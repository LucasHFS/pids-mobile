import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../../src/screens/Login';
import Register from '../../src/screens/Register';
import { Main } from './app.routes';
import { useAuth } from '../hooks/auth';

const Stack = createStackNavigator();
const AuthRoute: React.FC = () => {
  const { user } = useAuth();
  return (
    <Stack.Navigator initialRouteName={ user ? 'Main' : 'Login' }>

      <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Register" options={{ title: 'Cadastro' }} component={Register} />
      <Stack.Screen name="Main" options={{ headerShown: false }} component={Main} />

    </Stack.Navigator>
  )};

export default AuthRoute;