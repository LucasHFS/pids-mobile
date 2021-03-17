import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from 'react-native-elements';

export default function Settings() {

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', padding: 40 }}>
      <Text style={{ padding: 10, fontSize: 25, fontWeight: 'bold', }}>Settings</Text>


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
          onPress={() => {
            AsyncStorage.removeItem('@loggedUser')
            navigation.navigate('Login')
          }}
        />
      </View>
    </View>
  );
}