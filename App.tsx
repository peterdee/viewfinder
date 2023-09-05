import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import Main from './src/screens/main';
import Server from './src/screens/server';
import type {StackParamList} from './src/types/navigation';

const Stack = createNativeStackNavigator<StackParamList>();

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen component={Main} name="Main" />
        <Stack.Screen component={Server} name="Server" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
