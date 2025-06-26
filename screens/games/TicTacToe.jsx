import React, {useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerOne, setPlayerOne] = useState('X');
  const [playerTwo, setPlayerTwo] = useState('O');
  const [turn, setTurn] = useState(playerOne);

  const tilePress = (i) => {

    if (board[i] !== null) return;  // prevent overwriting

    const newBoard = [...board];
    newBoard[i] = turn;
    setBoard(newBoard);
    
    const isDraw = newBoard.every(tile => tile !== null);
    if (isDraw) {
      alert("Smth");
      setBoard(Array(9).fill(null));
      return;
    }

    setTurn(turn === playerOne ? playerTwo : playerOne);
  }


  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <Text style={styles.title}>Tic Tac Toe</Text>
        <View style={styles.tilesContainer}>

          {Array.from({ length: 9 }, (_, i) => {
            const style = [
              styles.tile,
              i < 6 && { borderBottomWidth: 2 },        // Bottom border
              i % 3 !== 2 && { borderRightWidth: 2 },   // Right border
            ];
            
            return (
              <TouchableOpacity key={i} style={style} onPress={() => tilePress(i)}>
                <Text style={styles.tileText}> {board[i]} </Text>
              </TouchableOpacity>
            );
          })}

        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    padding: 10,
  },
  tile: {
    width: '33.33%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#000',
  },
  tileText: {
    fontSize: 24,
  },
});

export default TicTacToe;
