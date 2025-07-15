import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

// Each card component with flip animation
const FlipCard = ({ card, isFlipped, isMatched, onFlip }) => {
  // Setup flip animation with initial value depending on flipped/matched status
  const flipAnim = useRef(new Animated.Value(isFlipped || isMatched ? 180 : 0)).current;

  // Interpolate for front side rotation
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  // Interpolate for back side rotation
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  // Animate card based on isFlipped or isMatched props
  useEffect(() => {
    Animated.spring(flipAnim, {
      toValue: isFlipped || isMatched ? 180 : 0,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [isFlipped, isMatched]);

  // Flip card only if it's not matched or already flipped
  const handleFlip = () => {
    if (!isFlipped && !isMatched) {
      onFlip(card); // Notify parent to update state
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleFlip}>
      <View>
        {/* Back side of the card - actual image revealed after flip */}
        <Animated.View
          style={[
            flipStyles.card,
            {
              transform: [{ rotateY: backInterpolate }],
              position: 'absolute',
              backfaceVisibility: 'hidden',
            },
          ]}
        >
          <Image
            source={card.image}
            style={flipStyles.cardImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Front side - card back (hidden side) */}
        <Animated.View
          style={[
            flipStyles.card,
            {
              transform: [{ rotateY: frontInterpolate }],
              backfaceVisibility: 'hidden',
            },
          ]}
        >
          <Image
            source={require('../../assets/icon.png')} // use your card back image
            style={flipStyles.cardImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Style for the flip cards
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

// Function to generate card pairs and shuffle them
function generateShuffledCards() {
  const uniqueImages = [
    { id: 1, image: require('../../assets/img1.jpg') },
    { id: 2, image: require('../../assets/img2.jpg') },
    { id: 3, image: require('../../assets/img3.jpg') },
    { id: 4, image: require('../../assets/img4.jpg') },
  ];

  // Create pairs
  const paired = [...uniqueImages, ...uniqueImages];

  // Add unique uid to each card
  const withUID = paired.map((item, index) => ({ ...item, uid: index }));

  // Shuffle cards using Fisher-Yates shuffle
  for (let i = withUID.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [withUID[i], withUID[j]] = [withUID[j], withUID[i]];
  }

  return withUID;
}

// Main Game Component
const MemoryGame = () => {
  const [showDropdownBtns, setShowDropdownBtns] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [cards, setCards] = useState(generateShuffledCards());

  const [flippedCards, setFlippedCards] = useState([]); // cards currently flipped
  const [matchedCards, setMatchedCards] = useState([]); // cards already matched
  const [isBusy, setIsBusy] = useState(false); // lock board when comparing  

  const navigation = useNavigation();

  const handleReset = () => {
    setFlippedCards([]);
    setMatchedCards([]);
    setCards(generateShuffledCards());
  }

  const handleOptionPress = (option) => {
    setShowDropdownBtns(false);

    if (option == 'Reset Game') handleReset();
    if (option === 'Help') {
      setModalMessage('Select identical cards to win the game!');
      setModalVisible(true);
    }
  };

  // Main game logic: handle a card flip
  const handleCardFlip = (card) => {
    if (isBusy || flippedCards.includes(card.uid) || matchedCards.includes(card.uid)) return;

    const newFlipped = [...flippedCards, card.uid];
    setFlippedCards(newFlipped);

    // When 2 cards are flipped, check if they match
    if (newFlipped.length === 2) {
      setIsBusy(true);

      const [first, second] = newFlipped;
      const firstCard = cards.find((c) => c.uid === first);
      const secondCard = cards.find((c) => c.uid === second);

      if (firstCard.id === secondCard.id) {
        // Match found
        setMatchedCards((prev) => [...prev, first, second]);
      }

      // Reset flipped state after delay
      setTimeout(() => {
        setFlippedCards([]);
        setIsBusy(false);
      }, 1000);
    }
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

        {/* Cards grid */}
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

// Styles for the entire app
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

export default MemoryGame;
