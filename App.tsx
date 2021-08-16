import 'react-native-gesture-handler';
import React from 'react';
import { View } from 'react-native';
import Routes from './src/routes';
import { NavigationContainer } from '@react-navigation/native';

import AppProvider from './src/hooks';

const App: React.FC = () => (
  <NavigationContainer>
    <AppProvider>
      <View style={{ flex: 1, backgroundColor: '#FFFFF'  }}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

export default App;