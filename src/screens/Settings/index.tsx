import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import { Button } from 'react-native-elements';

import { useAuth } from '../../hooks/auth';

export default function Settings() {

  const navigation = useNavigation();

  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 40, backgroundColor: '#FFFF' }}>
      <Text style={{ padding: 10, paddingTop: 30, fontSize: 25, fontWeight: 'bold', }}>Configurações</Text>


      <View style={{ padding: 20, width: 200, margin: 10 }}>
        <Button
          icon={
            <Icon
              name="user-circle"
              size={15}
              color="white"
            />
          }
          title=" Conta"
          onPress={() => navigation.navigate('AccountSettings')}
        />
      </View>

      <View style={{ padding: 20, width: 200 }}>

        <Button
          icon={
            <Icon
              name="arrow-right"
              size={15}
              color="white"
            />
          }
          title=" Sair"
          onPress={() => { signOut(); navigation.navigate('Login') }}
        />
      </View>
    </View>
  );
}