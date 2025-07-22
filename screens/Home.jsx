import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const Home = ({ navigation }) => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Mini Arcade</Text>

        <TouchableOpacity style={{ marginTop: -40 }} onPress={() => navigation.navigate('HighScoreScreen')}>
          <Text> Highscores </Text>
        </TouchableOpacity>

        <View style={styles.gamesList}>
          <TouchableOpacity style={styles.game} onPress={() => navigation.navigate('Snake')}>
            <Text style={styles.gameText}>Sneku</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.game} onPress={() => navigation.navigate('TicTacToe')}>
            <Text style={styles.gameText}>Tic Tac Toe</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.game} onPress={() => navigation.navigate('MemoryGame')}>
            <Text style={styles.gameText}>Memory Game</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.game} onPress={() => navigation.navigate('RPS')}>
            <Text style={styles.gameText}>Rock Paper Scissors</Text>
          </TouchableOpacity>
          
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf9',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#e76f51',
    marginBottom: 30,
  },
  gamesList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  game: {
    width: 140,
    height: 100,
    backgroundColor: '#fff',
    borderColor: '#f2dcdc',
    borderWidth: 2,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  gameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
});

export default Home;
