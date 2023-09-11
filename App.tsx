import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import CameraTest from './src/screens/CameraTest';
import Client from './src/screens/Client';
import Main from './src/screens/Main';
import Server from './src/screens/Server';
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
        <Stack.Screen component={CameraTest} name="CameraTest" />
        <Stack.Screen component={Client} name="Client" />
        <Stack.Screen component={Main} name="Main" />
        <Stack.Screen component={Server} name="Server" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
