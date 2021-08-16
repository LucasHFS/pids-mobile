import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../../src/screens/Login';
import Register from '../../src/screens/Register';
import Welcome from '../../src/screens/Welcome';




const Stack = createStackNavigator();
const AuthRoute: React.FC = () => (
  <Stack.Navigator initialRouteName="Login">

    {/* <Stack.Screen name="Welcome" options={{ title: 'Bem Vindo', headerShown: false }} component={Welcome} /> */}
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
    <Stack.Screen name="Register" options={{ title: 'Cadastro' }} component={Register} />

  </Stack.Navigator>
);

export default AuthRoute;