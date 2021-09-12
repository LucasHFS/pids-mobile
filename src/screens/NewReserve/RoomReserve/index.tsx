import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { Button } from 'react-native-elements';

export default function RoomReserve() {

  const navigation = useNavigation();


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 40, backgroundColor: '#FFFF' }}>
      <Text style={{ padding: 10, paddingTop: 30, fontSize: 25, fontWeight: 'bold', }}>Tipo de Reservas</Text>


      <View style={{ padding: 20, width: 200, margin: 10 }}>
        <Button
          // icon={
          //   <Icon
          //     name="user-circle"
          //     size={15}
          //     color="white"
          //   />
          // }
          title=" Salas"
          onPress={() => navigation.navigate('Room')}
        />
      </View>

      <View style={{ padding: 20, width: 200 }}>

        <Button
          // icon={
          //   <Icon
          //     name="arrow-right"
          //     size={15}
          //     color="white"
          //   />
          // }
          title=" Laboratório / Auditório"
          onPress={() => { navigation.navigate('Lab') }}
        />
      </View>
    </View>
  );
}