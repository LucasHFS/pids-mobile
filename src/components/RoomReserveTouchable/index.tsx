import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

// @ts-ignore
const RoomReserveTouchable = ({ reserve, onPress }) => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      key={reserve.id}
      onPress={() => onPress()}
    >
      {reserve.status === 'pending' ?
        <View style={styles.pending}>
          <Text style={styles.textInput2}>Status: <Text style={styles.textInput3}>{reserve.status || ''}</Text></Text>
          <Text style={styles.textInput2}>Sala:<Text style={styles.textInput3}> {reserve.room ? reserve.room.name : ''}</Text></Text>
        </View> : (reserve.status === 'accepted' ?
          <View style={styles.container}>
            <Text style={styles.textInput2}>Status: <Text style={styles.textInput3}>{reserve.status || ''}</Text></Text>
            <Text style={styles.textInput2}>Sala:<Text style={styles.textInput3}> {reserve.room ? reserve.room.name : ''}</Text></Text>
          </View>
          : (reserve.status === 'denied' ?
            <View style={styles.container}>
              <Text style={styles.textInput2}>Status: <Text style={styles.textInput3}>{reserve.status || ''}</Text></Text>
              <Text style={styles.textInput2}>Sala:<Text style={styles.textInput3}> {reserve.room ? reserve.room.name : ''}</Text></Text>
            </View>
            :
            null
          )
        )
      }


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
  pending: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FAFA71',
  },
  denied: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#FF9391',
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

export default RoomReserveTouchable;