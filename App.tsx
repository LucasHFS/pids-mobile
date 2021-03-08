import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


import Login from './src/screens/Login';
import Register from './src/screens/Register';
import Home from './src/screens/Home';
import Settings from './src/screens/Settings';


function Main(){
  const Tab = createBottomTabNavigator();

  return(
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'blue',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={Home} options={{tabBarIcon: ({color,size}) => <Ionicons name={'home'} size={size} color={color} />}}/>
      <Tab.Screen name="Settings" component={Settings} options={{tabBarIcon: ({color,size}) => <Ionicons name={'settings'} size={size} color={color} />}}/>
    </Tab.Navigator>
  )
}

export default function App() {

  const Stack = createStackNavigator();



  return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" options={{title: 'Cadastro'}} component={Register} />
            <Stack.Screen name="Main" options={{headerShown: false}} component={Main} />
          </Stack.Navigator>
      </NavigationContainer>
    );
  }