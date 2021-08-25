import React from 'react';
import { View, Text } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

// @ts-ignore
const SportCourtReserveTouchable = ({reserve, onPress}) => {
  return (
  <TouchableHighlight
  key={reserve.id}
  onPress={() => onPress()}
  >
    <View style={{ backgroundColor: 'white' }}>
      <Text>Status: {reserve.status || ''}</Text>
      <Text>Quadra: {reserve.sport_court ? reserve.sport_court.name : ''}</Text>
    </View>
  </TouchableHighlight>
)};

export default SportCourtReserveTouchable;