import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Vibration } from 'react-native';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [playerOne, setPlayerOne] = useState('X');
  const [playerTwo, setPlayerTwo] = useState('O');
  const [turn, setTurn] = useState(playerOne);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDropdownBtns, setShowDropdownsBtns] = useState(false);

  const xColor = '#ff6b6b';
  const oColor = '#4ecdc4';

  const navigation = useNavigation();

  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const checkWinner = (board) => {
    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  const tilePress = (i) => {
    if (board[i] !== null) return;

    const newBoard = [...board];
    newBoard[i] = turn;
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setModalMessage(`${winner} wins! 🎉`);
      setModalVisible(true);
      Vibration.vibrate(2000);
      return;
    }

    const isDraw = newBoard.every((tile) => tile !== null);
    if (isDraw) {
      setModalMessage("It's a draw! 🤝");
      setModalVisible(true);
      Vibration.vibrate(1000);
      return;
    }

    setTurn(turn === playerOne ? playerTwo : playerOne);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setTurn(playerOne);
    setModalVisible(false);
  };

  const handleOptionPress = (option) => {
    setShowDropdownsBtns(false);
    if (option === 'Reset Game') handleReset();
    if (option === 'Help') {
      setModalMessage("Tap a tile to place your mark. First to align 3 wins!");
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>

        <View style={styles.header}>
          
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#888" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Tic Tac Toe</Text>

          <TouchableOpacity
            style={styles.dropdownToggle}
            onPress={() => setShowDropdownsBtns(!showDropdownBtns)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
          </TouchableOpacity>
        </View>

          {showDropdownBtns && (
            <TouchableOpacity
              activeOpacity={1}
              style={styles.dropdownOverlay}
              onPress={() => setShowDropdownsBtns(false)}
            >

              <View style={styles.dropdown}>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleOptionPress('Help')}
                >
                  <Text style={styles.dropdownText}>Help</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleOptionPress('Reset Game')}
                >
                  <Text style={styles.dropdownText}>Reset Game</Text>
                </TouchableOpacity>

              </View>
            </TouchableOpacity>
          )}

        <View style={styles.container}>

          <Text style={styles.turnText}>
            Your move:{' '}
            <Text style={{ color: turn === 'X' ? xColor : oColor }}>{turn}</Text>
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

                <TouchableOpacity
                  key={i}
                  style={style}
                  onPress={() => tilePress(i)}
                >
                  <Text style={[styles.tileText, { color: tileColor }]}>
                    {board[i]}
                  </Text>
                </TouchableOpacity>

              );
            })}
          </View>

          <Modal transparent={true} visible={modalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Ionicons name="close-circle" size={32} color="#ff6b6b" />
                </TouchableOpacity>

                <Text style={styles.modalText}>{modalMessage}</Text>

                <TouchableOpacity
                  style={[styles.modalActionButton, { backgroundColor: '#4ecdc4' }]}
                  onPress={handleReset}
                >
                  <Text style={styles.modalActionText}>Play Again</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalActionButton, { backgroundColor: '#ffa69e' }]}
                  onPress={() => {
                    setModalVisible(false);
                    navigation.goBack();
                  }}
                >
                  <Text style={styles.modalActionText}>Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>


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
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 250, 249, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalBox: {
    backgroundColor: '#fffefc',
    borderRadius: 28,
    paddingVertical: 36,
    paddingHorizontal: 28,
    width: '88%',
    alignItems: 'center',
    borderColor: '#f4d6d6',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    transform: [{ scale: 1.02 }],
  },
  modalText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.4,
  },
  modalActionButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginTop: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalActionText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 56,
    right: 16,
    backgroundColor: '#fffdfc',
    borderWidth: 1,
    borderColor: '#f0e0dc',
    borderRadius: 12,
    paddingVertical: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 6,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  dropdownText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '500',
  },
  dropdownOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9, // less than dropdown zIndex so dropdown is clickable
  },
});

export default TicTacToe;
