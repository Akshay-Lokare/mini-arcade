import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, Button, StyleSheet } from 'react-native';

import Home from './screens/Home';
import TicTacToe from './screens/games/TicTacToe';
import Snake from './screens/games/Snake';
import MemoryGame from './screens/games/MemoryGame';

const Stack = createStackNavigator();

export default function App() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">

          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
          <Stack.Screen name="Snake" component={Snake} options={{ headerShown: false }}/>
          <Stack.Screen name="TicTacToe" component={TicTacToe} options={{ headerShown: false }}/>
          <Stack.Screen name="MemoryGame" component={MemoryGame} options={{ headerShown: false }}/>

        </Stack.Navigator>
      </NavigationContainer>

    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20
  }
});
