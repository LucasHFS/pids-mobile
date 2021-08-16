import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../../src/screens/Home';
import Settings from '../../src/screens/Settings';
import AccountSettings from '../../src/screens/AccountSettings';


const StackSettings = createStackNavigator();
const SettingsScreens: React.FC = () => (
  <StackSettings.Navigator initialRouteName="Settings">
    <StackSettings.Screen name="Settings" options={{ title: 'Configurações', headerShown: false }} component={Settings} />
    <StackSettings.Screen name="AccountSettings" options={{ title: 'Configurações da Conta' }} component={AccountSettings} />
  </StackSettings.Navigator>
);

const Tab = createBottomTabNavigator();
const Main: React.FC = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ color, size }) => <Ionicons name={'home'} size={size} color={color} /> }} />
    <Tab.Screen name="Configurações" component={SettingsScreens} options={{ tabBarIcon: ({ color, size }) => <Ionicons name={'settings'} size={size} color={color} /> }} />

  </Tab.Navigator>
);

const Stack = createStackNavigator();
const AppRoutes: React.FC = () => (
  <Stack.Navigator initialRouteName="Login">

    <Stack.Screen name="Main" options={{ headerShown: false }} component={Main} />

  </Stack.Navigator>
);

export default AppRoutes;