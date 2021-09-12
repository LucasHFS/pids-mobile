import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

// @ts-ignore
const EquipmentReserveTouchable = ({ reserve, onPress }) => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      key={reserve.id}
      onPress={() => onPress()}
    >
      <View style={styles.container}>
        <Text style={styles.textInput2}>Status: <Text style={styles.textInput3}> {reserve.status || ''}</Text></Text>
        <Text style={styles.textInput2}>Equip:<Text style={styles.textInput3}> {reserve.equipment ? reserve.equipment.name : ''}</Text></Text>
      </View>
    </TouchableHighlight>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#87BDFA',

  },
  textInput2: {
    fontWeight: 'bold',
    fontSize: 13
  },
  textInput3: {
    fontWeight: 'normal',
    fontSize: 12
  },

});

export default EquipmentReserveTouchable;