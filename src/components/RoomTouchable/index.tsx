import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';

// @ts-ignore
const RoomTouchable = ({ reserve, onPress }) => {
  return (
    <TouchableHighlight
      activeOpacity={0.6}
      underlayColor="#DDDDDD"
      key={reserve.id}
      onPress={() => onPress()}
    >
      <View style={styles.container}>
        <Text>Nome: {reserve ? reserve.name : ''}</Text>
        <Text>tipo: {reserve ? reserve.type : ''}</Text>
        <Text>Descrição: {reserve.description || ''}</Text>

      </View>
    </TouchableHighlight >
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

  countText: {
    color: "#FF00FF"
  }
});

export default RoomTouchable;