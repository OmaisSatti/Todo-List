import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import AddTask from './AddTask';
import UpdateTask from './UpdateTask';
import Finished from './Finished';
const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/>
      <Stack.Screen name="AddTask" component={AddTask} options={{headerTitle:'New Task',headerStyle:{backgroundColor:'#156ced'},headerTintColor:'#ffffff'}}/>
      <Stack.Screen name="UpdateTask" component={UpdateTask} options={{headerTitle:'Update Task',headerStyle:{backgroundColor:'#156ced'},headerTintColor:'#ffffff'}}/>
      <Stack.Screen name="Finished" component={Finished} options={{headerTitle:'Finished Task',headerStyle:{backgroundColor:'#156ced'},headerTintColor:'#ffffff'}}/>
    </Stack.Navigator>
  );
}
export default MyStack;