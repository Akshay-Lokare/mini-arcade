import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const Home = ({ navigation }) => {

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      
        <Text style={styles.title}>Smth</Text>
        <View style={styles.gamesList}>

            <TouchableOpacity style={styles.game}
                onPress={() => navigation.navigate('Snake')}
            >
                <Text>Sneku</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.game}
                onPress={() => navigation.navigate('TicTacToe')}
            >
                <Text>TTT</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.game}>
                <Text>df</Text>
            </TouchableOpacity>

        </View>

    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  gamesList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  game: {
    padding: 40,
    borderWidth: 2,
    borderRadius: 10,
    marginTop: 20
  }

});

export default Home;