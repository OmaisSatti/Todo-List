import { StyleSheet, Text, View, StatusBar, Image, Alert, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import SQLite from 'react-native-sqlite-storage';
import Snackbar from 'react-native-snackbar';
import FinishCard from '../components/FinishCard';
const Finished = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setloading] = useState(true)
  const db = SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
  const loadTasks = async () => {
    lst = []
    let sql = "SELECT * FROM tasks WHERE status = ?";
    db.transaction((tx) => {
      tx.executeSql(sql, ['finished'], (tx, resultSet) => {
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
  useEffect(() => {loadTasks();}, []);

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
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#156ced'} barStyle={'dark-content'} />
      {loading === false && tasks.length > 0 &&
        <FlatList
          style={{ marginHorizontal: 5 }}
          data={tasks}
          renderItem={({ item }) => {
            return <FinishCard title={item.title} dueDate={item.dueDate} onDelete={() => deleteConfirm(item.id)}/>
          }}
        />
      }

      {loading === false && tasks.length === 0 &&
        <View style={{ alignItems: 'center' }}>
          <Image style={styles.img} source={require('../images/todo2.png')} />
          <Text style={styles.txt}>No finished task</Text>
        </View>
      }
    </View>
  )
}
export default Finished
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#156ced'
  },
  img: {
    width: 230,
    height: 200,
    resizeMode: 'stretch'
  },
  txt: {
    color: '#ffffff',
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: 'Poppins-Medium'
  },
})