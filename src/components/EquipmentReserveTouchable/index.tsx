import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { format } from 'date-fns';

// @ts-ignore
const EquipmentReserveTouchable = ({ reserve, onPress }) => {
  const formatNotificationHour = (dirtyDate: string) => {
    const date = new Date(dirtyDate);
    return `${format(date, 'H:mm')}`
  }
  const formatNotificationDate = (dirtyDate: string) => {
    const date = new Date(dirtyDate);
    return `${format(date, 'd/M/yyyy')}`
  }

  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      key={reserve.id}
      onPress={() => onPress()}
    >
      <View style={styles.container}>
        <Text style={styles.textInput2}>Status: <Text style={styles.textInput3}> {reserve.status === 'accepted' ? 'Aprovada' : '' || ''}</Text></Text>
        <Text style={styles.textInput2}>Equipamento:<Text style={styles.textInput3}> {reserve.equipment ? reserve.equipment.name : ''}</Text></Text>
        <Text style={styles.textInput2}>Horário:<Text style={styles.textInput3}> {reserve.starts_at ? formatNotificationHour(reserve.starts_at) : ''}</Text></Text>
        <Text style={styles.textInput2}>Data:<Text style={styles.textInput3}> {reserve.starts_at ? formatNotificationDate(reserve.starts_at) : ''}</Text></Text>

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
    fontSize: 15
  },
  textInput3: {
    fontWeight: 'normal',
    fontSize: 15
  },

});

export default EquipmentReserveTouchable;