import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import Welcome from './src/screens/Welcome';
import Settings from './src/screens/Settings';
import AccountSettings from './src/screens/AccountSettings';

import AppProvider from './src/hooks';

function SettingsScreens() {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="Settings" options={{ title: 'Configurações', headerShown: false }} component={Settings} />
      <Stack.Screen name="AccountSettings" options={{ title: 'Configurações da Conta' }} component={AccountSettings} />
    </Stack.Navigator>
  )
}

function Main() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ color, size }) => <Ionicons name={'home'} size={size} color={color} /> }} />
      <Tab.Screen name="Configurações" component={SettingsScreens} options={{ tabBarIcon: ({ color, size }) => <Ionicons name={'settings'} size={size} color={color} /> }} />

    </Tab.Navigator>
  )
}

export default function App() {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      {/* <Stack.Navigator initialRouteName="Welcome">

        <Stack.Screen name="Welcome" options={{ title: 'Bem Vindo', headerShown: false }} component={Welcome} />
        <Stack.Screen name="Login" component={Login} options={{}} />
        <Stack.Screen name="Register" options={{ title: 'Cadastro' }} component={Register} />
        <Stack.Screen name="Main" options={{ headerShown: false }} component={Main} />

      </Stack.Navigator> */}
    </NavigationContainer>
  );
}