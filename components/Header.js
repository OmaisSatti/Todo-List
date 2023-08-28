import { View, Text, StyleSheet,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
const Header = ({ onPress, title, name }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.txt}>{title}</Text>
      <TouchableOpacity onPress={onPress}>
        <Icon
          name={name}
          size={25}
          style={{ marginRight: 20 }}
          color="rgba(255, 255, 255, 1)"
        />
      </TouchableOpacity>
    </View>
  );
};
export default Header;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#156ced',
    padding: 10,
    elevation: 20,
  },
  txt: {
    color: 'rgba(255, 255, 255, 1)',
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    fontStyle: 'normal',
    marginLeft: 10,
  },
});
