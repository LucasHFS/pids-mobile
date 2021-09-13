import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../../src/screens/Login';
import Register from '../../src/screens/Register';
import { Main } from './app.routes';
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api';

const Stack = createStackNavigator();
const AuthRoute: React.FC = () => {
  const [user, setUser] = useState(undefined);
  
  useEffect(() => {
    async function tokenValid (token: string):Promise<boolean> {
      let valid = true;
      const config = {
        params: {
          token
        }
      };
      
      try{
        const response = await api.get('sessions/verify_token', config)
        valid = response.data.valid
      } catch(err){
        console.log(err)
        valid = false;
      }

      return valid
    }

    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@EReserva:token',
        '@EReserva:user',
      ]);

      if (token[1] && user[1]) {
        if(await tokenValid(token[1])){
          setUser(JSON.parse(user[1]))
        }else {
          // @ts-ignore
          setUser(null)
        }
      } else {
        // @ts-ignore
        setUser(null)
      }
    }
    loadStoragedData();
  }, []);

  return (
    user === undefined ? null : 
    <>
      <Stack.Navigator initialRouteName={ user === null ? 'Login' : 'Main' }>

        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" options={{ title: 'Cadastro' }} component={Register} />
        <Stack.Screen name="Main" options={{ headerShown: false }} component={Main} />

      </Stack.Navigator>
    </>
  )};

export default AuthRoute;