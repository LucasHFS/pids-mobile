import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import Home from '../../src/screens/Home';
import NewEquipmentReserve from '../screens/NewReserve/NewEquipmentReserve';
import NewReserve from '../screens/NewReserve';
import Settings from '../../src/screens/Settings';
import AccountSettings from '../../src/screens/AccountSettings';
import SportCourtReserve from '../screens/NewReserve/SportCourtReserve';
import RoomReserve from '../screens/NewReserve/RoomReserve';

const StackSettings = createStackNavigator();
const SettingsScreens: React.FC = () => (
  <StackSettings.Navigator initialRouteName="Settings">
    <StackSettings.Screen name="Settings" options={{ title: 'Configurações', headerShown: false }} component={Settings} />
    <StackSettings.Screen name="AccountSettings" options={{ title: 'Configurações da Conta' }} component={AccountSettings} />
  </StackSettings.Navigator>
);

const Principal = createStackNavigator();
const PrincipalScreens: React.FC = () => (
  <Principal.Navigator initialRouteName="Home">
    <Principal.Screen name="Home" options={{ title: 'Home', headerShown: false }} component={Home} />
    <Principal.Screen name="NewReserve" options={{ title: 'Nova Reserva', headerShown: false }} component={NewReserve} />
    <Principal.Screen name="NewEquipmentReserve" options={{ title: 'Nova Reserva de Equipamentos', headerShown: false }} component={NewEquipmentReserve} />
    <Principal.Screen name="RoomReserve" options={{ title: 'Reserva de Salas', headerShown: false }} component={RoomReserve} />
    <Principal.Screen name="SportCourtReserve" options={{ title: 'Reserva de Quadras', headerShown: false }} component={SportCourtReserve} />
  </Principal.Navigator>
);

const Tab = createBottomTabNavigator();
const Main: React.FC = () => (
  <Tab.Navigator
    tabBarOptions={{
      activeTintColor: 'blue',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name="Home" component={PrincipalScreens} options={{ tabBarIcon: ({ color, size }) => <Ionicons name={'home'} size={size} color={color} /> }} />
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