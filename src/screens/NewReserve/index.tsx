import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
// import { useAuth } from '../../hooks/auth';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';


interface LoggedUser {
  id: number
  cpf: string
  name: string
  email: string
  phone: string
  bond: string
  course: string
}

export default function NewReserve() {

  // const { user } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 20, width: 200, margin: 10 }}>
        <Button
          title="Reservas de Equipamentos"
          onPress={() => navigation.navigate('EquipmentReserve')}
        />
      </View>

      <View style={{ padding: 20, width: 200, margin: 10 }}>
        <Button
          title="Reservas de Salas"
          onPress={() => navigation.navigate('RoomReserve')}
        />
      </View>

      <View style={{ padding: 20, width: 200, margin: 10 }}>
        <Button
          title="Reservas de Quadras"
          onPress={() => navigation.navigate('SportCourtReserve')}
        />
      </View>
    </View>
  );
}