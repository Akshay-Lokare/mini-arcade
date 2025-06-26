import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerOne, setPlayerOne] = useState('X');
  const [playerTwo, setPlayerTwo] = useState('O');
  const [turn, setTurn] = useState(playerOne);

  const xColor = '#ff6b6b'; // coral-pink
  const oColor = '#4ecdc4'; // mint-teal

  const navigation = useNavigation();

  const tilePress = (i) => {
    if (board[i] !== null) return;

    const newBoard = [...board];
    newBoard[i] = turn;
    setBoard(newBoard);

    const isDraw = newBoard.every(tile => tile !== null);
    if (isDraw) {
      Alert.alert('Draw!', 'That was a close one! 😄');
      setBoard(Array(9).fill(null));
      return;
    }

    setTurn(turn === playerOne ? playerTwo : playerOne);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#888" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Tic Tac Toe</Text>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.container}>
          <Text style={styles.turnText}>
            Your move: <Text style={{ color: turn === 'X' ? xColor : oColor }}>{turn}</Text>
          </Text>

          <View style={styles.board}>
            {Array.from({ length: 9 }, (_, i) => {
              const style = [
                styles.tile,
                i < 6 && { borderBottomWidth: 1 },
                i % 3 !== 2 && { borderRightWidth: 1 },
              ];

              const tileColor = board[i] === playerOne ? xColor : oColor;

              return (
                <TouchableOpacity key={i} style={style} onPress={() => tilePress(i)}>
                  <Text style={[styles.tileText, { color: tileColor }]}>
                    {board[i]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff0f0',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e76f51',
    textAlign: 'center',
    flex: 1,
  },
  turnText: {
    fontSize: 18,
    marginVertical: 20,
    color: '#444',
    fontWeight: '500',
  },
  board: {
    width: 300,
    height: 300,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#e4dcdc',
    borderRadius: 12,
    overflow: 'hidden',
  },
  tile: {
    width: '33.33%',
    height: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  tileText: {
    fontSize: 48,
    fontWeight: '700',
  },
});

export default TicTacToe;
