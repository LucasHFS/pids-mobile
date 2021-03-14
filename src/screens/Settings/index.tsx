import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  
  const navigation = useNavigation();
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}> 
      <Text>Settings</Text>

      <View>
        <TouchableOpacity
          onPress={()=> navigation.navigate('AccountSettings')}
       >
          <Text>Conta</Text>
        </TouchableOpacity>
      </View> 

      <View > 
        <TouchableOpacity
          onPress={()=> {
            AsyncStorage.removeItem('@loggedUser')
            navigation.navigate('Login')
          }}
        >
          <Text>Sair</Text>
        </TouchableOpacity>
      </View> 
    </View>
  );
}