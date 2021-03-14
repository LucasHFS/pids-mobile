import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface LoggedUser{
  id: number
  cpf:string
  name:string
  email:string
  phone:string
  bond:string
  course:string
}

export default function Home() {

  const [user, setUser] = useState<LoggedUser>({id: -1, name:'', cpf:'',email:'', phone:'', bond:'',course:''});


  useEffect(() => {
    const _getData = async (key:string) => {
      try {
        const jsonValue = await AsyncStorage.getItem(key)
        setUser( jsonValue != null ? JSON.parse(jsonValue) : null);
      } catch(e) {
        console.log(e)
      }
    }
    _getData('@loggedUser');
  },[]);




  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Coming Soon</Text>
      <Text>Welcome: {user.name}</Text>
    </View>
  );
}