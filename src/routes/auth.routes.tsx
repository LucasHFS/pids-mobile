import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../../src/screens/Login';
import Register from '../../src/screens/Register';
import { Main } from './app.routes';
import AsyncStorage from '@react-native-community/async-storage'

const Stack = createStackNavigator();
const AuthRoute: React.FC = () => {
  const [user, setUser] = useState(undefined)
  useEffect(() => {
    async function loadStoragedData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@EReserva:token',
        '@EReserva:user',
      ]);

      if (user[1]) {
        setUser(JSON.parse(user[1]))
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