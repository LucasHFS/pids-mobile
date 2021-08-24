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

export default function SportCourtReserve() {

  // const { user } = useAuth();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1 }}>
      <Text>SportCourt Reserves</Text>
    </View>
  );
}