import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Snackbar } from 'react-native-paper';
import { updateRPSScore } from '../../redux/scoreSlice';

const RPS = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const highScore = useSelector((state) => state.scores.rps);

  const rps = [
    { id: "rock", value: "rock" },
    { id: "paper", value: "paper" },
    { id: "scissor", value: "scissor" },
  ];

  const [userRps, setUserRps] = useState({ id: '', value: '' });
  const [compRps, setCompRps] = useState({ id: '', value: '' });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDropdownBtns, setShowDropdownBtns] = useState(false);

  const [streak, setStreak] = useState(0); 
  const [gameOver, setGameOver] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const playerOneGamePlay = (choice) => {
    if (gameOver) {
      setModalMessage("Game over! Try again!");
      setModalVisible(true);
      return;
    }

    const selected = { id: choice, value: choice };
    setUserRps(selected);

    const item = rps[Math.floor(Math.random() * rps.length)];
    setCompRps(item);

    // Wait a while before resetting choices otherwise it's resetting the comp choice and we can't see it
    setTimeout(() => {
      if (selected.id === item.id) {

        setSnackbarMessage(`Draw! Both chose ${choice}.`);
        setSnackbarVisible(true);
        setUserRps({ id: "", value: "" });
        setCompRps({ id: "", value: "" });
        
      } else if (
        (selected.id === 'rock' && item.id === 'scissor') ||
        (selected.id === 'scissor' && item.id === 'paper') ||
        (selected.id === 'paper' && item.id === 'rock')
      ) {

        setStreak(streak + 1);
        setSnackbarMessage(`You win! Streak: ${streak + 1}`);
        setSnackbarVisible(true);
        setUserRps({ id: "", value: "" });
        setCompRps({ id: "", value: "" });
      } else {

        setGameOver(true);
        setModalMessage(`Game over! Your streak: ${streak}`);
        setModalVisible(true);
        if (streak > highScore) {
          dispatch(updateRPSScore(streak));
        }
      }
    }, 600);
  };


  const getIcon = (type) => {
    if (type === 'rock') return 'hand-rock';
    if (type === 'paper') return 'hand-paper';
    if (type === 'scissor') return 'hand-scissors';
    return null;
  };

  const handleReset = () => {
    setCompRps({ id: "", value: "" });
    setUserRps({ id: "", value: "" });
    setStreak(0);
    setGameOver(false);
    setModalVisible(false);
  };

  const handleOptionPress = (option) => {
    setShowDropdownBtns(false);
    if (option === 'Reset Game') handleReset();
    if (option === 'How to Play') {
      setModalMessage("Beat the computer by picking the dominating option!");
      setModalVisible(true);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#888" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rock Paper Scissors</Text>
          <TouchableOpacity
            style={styles.dropdownToggle}
            onPress={() => setShowDropdownBtns(!showDropdownBtns)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Text style={styles.streak}>Streak: {streak}    Highscore: {highScore}</Text>

        {showDropdownBtns && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.dropdownOverlay}
            onPress={() => setShowDropdownBtns(false)}
          >
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleOptionPress('Reset Game')}
              >
                <Text style={styles.dropdownText}>Reset Game</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleOptionPress('How to Play')}
              >
                <Text style={styles.dropdownText}>How to Play</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.gameArea}>
          <View style={styles.onePlayerContainer}>

            <View style={styles.compOption}>
              <View style={styles.compOptionContent}>
                {compRps.id !== '' ? (
                  <FontAwesome5 name={getIcon(compRps.id)} size={50} color="#d25c5c" />
                ) : (
                  <Text style={styles.compText}>Computer is waiting...</Text>
                )}
              </View>
            </View>

            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => playerOneGamePlay("rock")}
                disabled={gameOver}
              >
                <FontAwesome5 name="hand-rock" size={32} color="#444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => playerOneGamePlay("paper")}
                disabled={gameOver}
              >
                <FontAwesome5 name="hand-paper" size={32} color="#444" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => playerOneGamePlay("scissor")}
                disabled={gameOver}
              >
                <FontAwesome5 name="hand-scissors" size={32} color="#444" />
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 30, alignItems: 'center' }}>
              <Text style={styles.yourOptionText}>Your Option:</Text>
              {userRps.id !== '' && (
                <FontAwesome5 name={getIcon(userRps.id)} size={50} color="#d25c5c" />
              )}
            </View>
          </View>

          <Modal transparent={true} visible={modalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Ionicons name="close-circle" size={32} color="#ff6b6b" />
                </TouchableOpacity>
                <Text style={styles.modalText}>{modalMessage}</Text>
                <TouchableOpacity
                  style={[styles.modalActionButton, { backgroundColor: '#4ecdc4' }]}
                  onPress={() => {
                    setModalVisible(false);
                    if (gameOver) {
                      handleReset();
                    }
                  }}
                >
                  <Text style={styles.modalActionText}>{gameOver ? "Play Again" : "Continue"}</Text>
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

          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={2000}
            action={{
              label: 'OK',
              onPress: () => setSnackbarVisible(false),
            }}
            theme={{ colors: { accent: '#4ecdc4' } }}
          >
            {snackbarMessage}
          </Snackbar>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef7f5',
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
  streak: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  onePlayerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  compOption: {
    width: '90%',
    height: 130,
    backgroundColor: '#fff5f5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#e3b3b3',
    elevation: 3,
  },
  compOptionContent: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  compText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#a33',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  optionCard: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    elevation: 3,
    marginHorizontal: 8,
    minWidth: 90,
  },
  yourOptionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
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

export default RPS;
