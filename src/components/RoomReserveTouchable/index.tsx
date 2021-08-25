import React from 'react';
import { View, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

// @ts-ignore
const RoomReserveTouchable = ({reserve, onPress}) => {
  return (
  <TouchableHighlight
  key={reserve.id}
  onPress={() => onPress()}
  >
    <View style={{ backgroundColor: 'white' }}>
      <Text>Status: {reserve.status || ''}</Text>
      <Text>Sala: {reserve.room ? reserve.room.name : ''}</Text>
    </View>
  </TouchableHighlight>
)};

export default RoomReserveTouchable;