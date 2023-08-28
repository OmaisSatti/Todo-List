import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, ToastAndroid } from 'react-native'
import Ant from 'react-native-vector-icons/AntDesign'
import React, { useState } from 'react'
import SQLite from 'react-native-sqlite-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import Snackbar from 'react-native-snackbar';
const AddTask = ({ navigation }) => {
  const [title, settitle] = useState('')
  const [dueDate, setdueDate] = useState(new Date())
  const [status, setstatus] = useState('pending')
  const [show, setShow] = useState(false);
  const db = SQLite.openDatabase({ name: 'tasks.db', location: 'default' });
  const createTask = (title, dueDate) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO tasks (title, dueDate,status) VALUES (?, ?,?)',
        [title, dueDate.toDateString(),status],
        (_, result) => {
          Snackbar.show({
            text: 'Task added',
            duration: Snackbar.LENGTH_SHORT,
          });
          settitle('')
          navigation.goBack()
        },
        (_, error) => {
          ToastAndroid.show('Error adding task:', ToastAndroid.SHORT);
        }
      );
    });
  };
  const addTask = () => {
    if (title.length == 0) {
      Snackbar.show({
        text: 'enter task at first',
        duration: Snackbar.LENGTH_SHORT,
      });
    } else {
      createTask(title, dueDate)
    }
  }
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setdueDate(currentDate);
  };
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#156ced'} barStyle={'dark-content'} />
      <View style={{ margin: 20 }}>

        <Text style={styles.inputText}>What is to be done?</Text>
        <TextInput style={styles.input} placeholder='Enter Task here' placeholderTextColor={'#f0f2f5'} value={title}
          onChangeText={(txt) => settitle(txt)} />
        <Text style={styles.inputText}>Due date</Text>

        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <TextInput style={styles.dateInput} value={dueDate.toDateString()} placeholderTextColor={'#f0f2f5'} placeholder='Date not set' />
          <TouchableOpacity onPress={() => setShow(!show)}>
            <Ant name={'calendar'} size={30} color={'#ffffff'} />
          </TouchableOpacity>
        </View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={dueDate}
            mode={'date'}
            minimumDate={dueDate}
            onChange={onChange}
            display={'inline'}
          />
        )}

      </View>
      <TouchableOpacity style={styles.btn} onPress={() => addTask()}>
        <Ant name={'check'} size={30} color={'#156ced'} />
      </TouchableOpacity>
    </View>
  )
}
export default AddTask
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#156ced'
  },
  input: {
    width: '90%',
    margin: 10,
    padding: 10,
    color: '#000080',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    borderBottomWidth: 1.5,
    borderColor: '#dedcdc'
  },
  dateInput: {
    width: '80%',
    margin: 10,
    padding: 10,
    color: '#000080',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    borderBottomWidth: 1.5,
    borderColor: '#dedcdc'
  },
  inputText: {
    fontSize: 18,
    fontWeight: '800',
    margin: 10,
    color: '#000080',
    fontFamily: 'Poppins-Regular',
  },
  btn: {
    backgroundColor: '#ffffff',
    width: 65,
    height: 65,
    position: 'absolute',
    bottom: 20, right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  }
})