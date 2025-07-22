import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { updateMemoryScore } from "../../redux/scoreSlice";

const FlipCard = ({ card, isFlipped, isMatched, onFlip }) => {
  const flipAnim = useRef(new Animated.Value(isFlipped || isMatched ? 180 : 0)).current;
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped || isMatched ? 180 : 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, isMatched]);

  const handleFlip = () => {
    if (!isFlipped && !isMatched) {
      onFlip(card);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <View>
        <Animated.View
          style={[
            flipStyles.card,
            {
              transform: [{ rotateY: backInterpolate }],
              position: "absolute",
              backfaceVisibility: "hidden",
            },
          ]}
        >
          <Image
            source={card.image}
            style={flipStyles.cardImage}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View
          style={[
            flipStyles.card,
            {
              transform: [{ rotateY: frontInterpolate }],
              backfaceVisibility: "hidden",
            },
          ]}
        >
          <Image
            source={require('../../assets/icon.png')}
            style={flipStyles.cardImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

function generateShuffledCards() {
  const uniqueImages = [
    { id: 1, image: require('../../assets/img1.jpg') },
    { id: 2, image: require('../../assets/img2.jpg') },
    { id: 3, image: require('../../assets/img3.jpg') },
    { id: 4, image: require('../../assets/img4.jpg') },
  ];
  const paired = [...uniqueImages, ...uniqueImages];
  const withUID = paired.map((item, index) => ({ ...item, uid: index }));
  for (let i = withUID.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [withUID[i], withUID[j]] = [withUID[j], withUID[i]];
  }
  return withUID;
}

const MemoryGame = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const highScore = useSelector((state) => state.scores.memory);

  const [cards, setCards] = useState(generateShuffledCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isBusy, setIsBusy] = useState(false); // Prevent double taps during animation

  const [isGameActive, setIsGameActive] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showDropdownBtns, setShowDropdownBtns] = useState(false);

  // Reset game
  const handleReset = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setCards(generateShuffledCards());
    setIsGameActive(false);
    setElapsedSeconds(0);
    setGameStartTime(null);
  };

  const handleOptionPress = (option) => {
    setShowDropdownBtns(false);
    if (option === 'Reset Game') handleReset();
    if (option === 'Help') {
      setModalMessage('Select identical cards to win the game!');
      setModalVisible(true);
    }
  };


  const handleCardFlip = (card) => {
    if (isBusy || flippedCards.includes(card.uid) || matchedCards.includes(card.uid)) return;


    if (!isGameActive) {
      setIsGameActive(true);
      setGameStartTime(Date.now());
      setElapsedSeconds(0);
    }

    const newFlipped = [...flippedCards, card.uid];
    setFlippedCards(newFlipped);


    if (newFlipped.length === 2) {
      setIsBusy(true);
      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.uid === first);
      const secondCard = cards.find((c) => c.uid === second);

      if (firstCard.id === secondCard.id) {
        // Match found
        setMatchedCards((prev) => [...prev, first, second]);
        // Check if all pairs are matched
        if (matchedCards.length + 2 === cards.length) {
          setIsGameActive(false);
          const finalTime = Math.floor((Date.now() - gameStartTime) / 1000);

          dispatch(updateMemoryScore(finalTime));
          setModalMessage(`You won in ${Math.floor(finalTime/60)}:${('0'+finalTime%60).slice(-2)}!`);
          setModalVisible(true);
        }
      }

      setTimeout(() => {
        setFlippedCards([]);
        setIsBusy(false);
      }, 1000);
    }
  };

  useEffect(() => {
    let interval;
    if (isGameActive) {
      interval = setInterval(() => {
        setElapsedSeconds(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, gameStartTime]);

  // Format seconds as MM:SS
  const formatTime = (seconds) => {
    return seconds === 0 
      ? '0:00' 
      : `${Math.floor(seconds/60)}:${('0'+(seconds%60)).slice(-2)}`;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>

          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color="#888" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Memory Game</Text>

          <TouchableOpacity
            style={styles.dropdownToggle}
            onPress={() => setShowDropdownBtns(!showDropdownBtns)}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <Text style={styles.infoText}>
          Time: {formatTime(elapsedSeconds)} | Best: {formatTime(highScore || 0)}
        </Text>

        {showDropdownBtns && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.dropdownOverlay}
            onPress={() => setShowDropdownBtns(false)}
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


        <View style={styles.cardsWrapper}>
          <View style={styles.cardsContainer}>

            {cards.map((card) => (
              <FlipCard
                key={card.uid}
                card={card}
                isFlipped={flippedCards.includes(card.uid)}
                isMatched={matchedCards.includes(card.uid)}
                onFlip={handleCardFlip}
              />
            ))}

          </View>
        </View>

        {/* Help modal */}
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
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalActionText}>Close</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
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
  infoText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 5,
    color: '#333',
  },
  cardsWrapper: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fffaf9',
    paddingHorizontal: 6,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
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
    zIndex: 9,
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
    elevation: 8,
  },
  modalText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
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

const flipStyles = StyleSheet.create({
  card: {
    width: 90,
    height: 90,
    backgroundColor: '#fff',
    borderColor: '#f2dcdc',
    borderWidth: 2,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    elevation: 4,
  },
  cardImage: {
    width: '80%',
    height: '80%',
  },
});

export default MemoryGame;
