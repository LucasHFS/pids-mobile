import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';


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
    </View>
  );
}