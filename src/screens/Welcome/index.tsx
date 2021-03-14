import React, { useEffect, useState } from 'react';
import { Text, View, Image, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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



export default function Welcome() {

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


  const navigation = useNavigation();


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View>{/* Header */}
        <Image source={require('../../../assets/e-reserva.png')}/>
      </View>

      <View>{/* Center */}
        <Text>Reserve Recursos da UEG de seu Conforto</Text>

        <Button
          color="blue"
          title='Acessar'
          onPress={() => {
            if(user && user.id && user.id > 0){
              navigation.navigate('Main')
            }else{
              navigation.navigate('Login')
            }
          }}
        />
      </View>

      <View>{/* Footer */}
        <Text>Desenvolvido por</Text>
        <Image source={require('../../../assets/boost_ti.png')}/>
      </View>
    </View>
  );
}