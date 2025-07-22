import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

import Home from './screens/Home';
import TicTacToe from './screens/games/TicTacToe';
import Snake from './screens/games/Snake';
import MemoryGame from './screens/games/MemoryGame';
import RPS from './screens/games/RPS';
import store from './redux/store';
import HighScoreScreen from './screens/HighScoreScreen';

const Stack = createStackNavigator();

export default function App() {

  return (
    <Provider store={store}> 
    <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">

          <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
          <Stack.Screen name="Snake" component={Snake} options={{ headerShown: false }}/>
          <Stack.Screen name="TicTacToe" component={TicTacToe} options={{ headerShown: false }}/>
          <Stack.Screen name="MemoryGame" component={MemoryGame} options={{ headerShown: false }}/>
          <Stack.Screen name="RPS" component={RPS} options={{ headerShown: false }}/>
          <Stack.Screen name="HighScoreScreen" component={HighScoreScreen} options={{ headerShown: false }}/>

        </Stack.Navigator>
      </NavigationContainer>

    </GestureHandlerRootView>
    </Provider>
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
