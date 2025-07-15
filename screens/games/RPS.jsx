import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal
} from 'react-native';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const RPS = () => {
  const navigation = useNavigation();

  const [mode, setMode] = useState(null);
  const [rps] = useState([
    { id: "rock", value: "rock" },
    { id: "paper", value: "paper" },
    { id: "scissor", value: "scissor" },
  ]);

  const [userRps, setUserRps] = useState({ id: '', value: '' });
  const [compRps, setCompRps] = useState({ id: '', value: '' });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    if (mode === '1P') console.log('1 Player mode selected');
    else if (mode === '2P') console.log('2 Players mode selected');
    else console.log('Select Mode');
  }, [mode]);

  const playerOneGamePlay = (choice) => {
    const selected = { id: choice, value: choice };
    setUserRps(selected);

    const item = rps[Math.floor(Math.random() * rps.length)];
    setCompRps(item);

    console.log(`User chose: ${selected.value}`);
    console.log(`Computer chose: ${item.value}`);

    if (selected.id === item.id) {
      setModalMessage("It's a Draw!");
    } else if (
      (selected.id === 'rock' && item.id === 'scissor') ||
      (selected.id === 'scissor' && item.id === 'paper') ||
      (selected.id === 'paper' && item.id === 'rock')
    ) {
      setModalMessage("Congratulations! You won!!");
    } else {
      setModalMessage("Tough Luck! Computer won.");
    }

    setModalVisible(true);
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
    setModalVisible(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color="#555" />
          </TouchableOpacity>
          <Text style={styles.title}>Rock Paper Scissors</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.gameArea}>
          {mode === null ? (
            <>
              <TouchableOpacity style={styles.modeButton} onPress={() => setMode('1P')}>
                <Text style={styles.modeButtonText}>1 Player</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modeButton} onPress={() => setMode('2P')}>
                <Text style={styles.modeButtonText}>2 Players</Text>
              </TouchableOpacity>
            </>

          ) : mode === '1P' ? (
            <View style={styles.onePlayerContainer}>
              {/* Computer's Option */}
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

                <TouchableOpacity style={styles.optionCard} onPress={() => playerOneGamePlay("rock")}>
                  <FontAwesome5 name="hand-rock" size={32} color="#444" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionCard} onPress={() => playerOneGamePlay("paper")}>
                  <FontAwesome5 name="hand-paper" size={32} color="#444" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionCard} onPress={() => playerOneGamePlay("scissor")}>
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
          ) : (
            <Text style={styles.infoText}>You selected 2 Players Mode</Text>
          )}


          {/* Modal */}
          <Modal transparent={true} visible={modalVisible} animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalBox}>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
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
    backgroundColor: '#fef7f5',
  },
  header: {
    paddingTop: 14,
    paddingBottom: 16,
    paddingHorizontal: 18,
    backgroundColor: '#ffe3e3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d25c5c',
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  modeButton: {
    backgroundColor: '#ffdada',
    paddingVertical: 16,
    paddingHorizontal: 50,
    borderRadius: 16,
    marginVertical: 14,
    elevation: 4,
  },
  modeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8b2e2e',
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
  infoText: {
    fontSize: 18,
    color: '#555',
    marginTop: 30,
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
});

export default RPS;
