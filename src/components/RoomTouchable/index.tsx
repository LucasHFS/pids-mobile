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
        <Text style={styles.textInput2}>Nome: <Text style={styles.textInput3}>{reserve ? reserve.name : ''}</Text></Text>
        <Text style={styles.textInput2}>tipo: <Text style={styles.textInput3}>{reserve ? reserve.type : ''}</Text></Text>
        <Text style={styles.textInput2}>Descrição: <Text style={styles.textInput3}>{reserve.description || ''}</Text></Text>

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

export default RoomTouchable;