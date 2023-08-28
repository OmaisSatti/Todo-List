import { StyleSheet, Text, View, StatusBar, Image, TouchableOpacity, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import ItemCard from '../components/ItemCard'
import Ant from 'react-native-vector-icons/AntDesign'
import SQLite from 'react-native-sqlite-storage';
import Snackbar from 'react-native-snackbar';
import Header from '../components/Header';
const Home = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setloading] = useState(true)
  const db = SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
  const [status, setstatus] = useState('finished')
  const createTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, dueDate TEXT,status TEXT)',
        [],
        () => {
          console.log('Table created successfully!');
        },
        (_, error) => {
          console.error('Error creating table:', error);
        }
      );
    });
  }
  const loadTasks = async () => {
    lst = []
    let sql = "SELECT * FROM tasks WHERE status = ?";
    db.transaction((tx) => {
      tx.executeSql(sql, ['pending'], (tx, resultSet) => {
        var length = resultSet.rows.length;
        for (var i = 0; i < length; i++) {
          lst.push(resultSet.rows.item(i))
        }
        setTasks(lst)
        setloading(false)
      }, (error) => {
        console.log("List user error", error);
      })
    })
  }
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setloading(true)
      loadTasks();
    });
    return unsubscribe;
  }, [navigation]);
  useEffect(() => {createTable()}, [])
  const deleteTask = (taskId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM tasks WHERE id = ?',
        [taskId],
        (_, result) => {
          const newData = tasks.filter(d => d.id !== taskId)
          setTasks(newData)
          Snackbar.show({
            text: 'Task deleted',
            duration: Snackbar.LENGTH_SHORT,
          });
        },
        (_, error) => {
          console.error('Error deleting task:', error);
        }
      );
    });
  };
  const deleteConfirm = (id) =>
    Alert.alert('Are you sure?', 'Delete task?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => deleteTask(id) },
    ]);
    
  const eiditStatus = (taskId) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE tasks SET status = ? WHERE id = ?',
        [status,taskId],
        (_, result) => {
          const newData = tasks.filter(d => d.id !== taskId)
          setTasks(newData)
        },
        (_, error) => {
          console.error('Error updating task:', error);
        }
      );
    });
  };
  return (
    <View style={styles.container}>
      <Header title={'All List'} name={'checkcircle'} onPress={() => navigation.navigate('Finished')} />
      <StatusBar backgroundColor={'#156ced'} barStyle={'dark-content'} />
      {loading === false && tasks.length > 0 &&
        <FlatList
          style={{ marginHorizontal: 5 }}
          data={tasks}
          renderItem={({ item }) => {
            return <ItemCard title={item.title} dueDate={item.dueDate}
              onDelete={() => deleteConfirm(item.id)} onPress={() => navigation.navigate('UpdateTask', { title: item.title, dueDate: item.dueDate, id: item.id })} onEidit={()=>eiditStatus(item.id)}/>
          }}
        />
      }

      {loading === false && tasks.length === 0 &&
        <View style={{ alignItems: 'center',justifyContent:'center',flex:1}}>
          <Image style={styles.img} source={require('../images/todo.png')} />
          <Text style={styles.txt}>Nothing to do</Text>
        </View>
      }
      <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('AddTask')}>
        <Ant name={'plus'} size={30} color={'#156ced'} />
      </TouchableOpacity>
    </View>
  )
}
export default Home
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#156ced'
  },
  img: {
    width: 350,
    height: 220,
    resizeMode: 'stretch'
  },
  txt: {
    color: '#ffffff',
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium'
  },
  btn: {
    //backgroundColor:'#87CEEB',
    // backgroundColor:'#FFA500',
    // backgroundColor:'#D3D3D3',
    backgroundColor: '#ffffff',
    // backgroundColor:'#FF0000',
    width: 65,
    height: 65,
    position: 'absolute',
    bottom: 20, right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  }

})