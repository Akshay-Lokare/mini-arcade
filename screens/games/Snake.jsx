import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  PanResponder,
  Animated,
} from 'react-native';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { updateSnakeScore } from '../../redux/scoreSlice';
import { Vibration } from 'react-native';

const CELL_SIZE = 20;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const BOARD_HEIGHT = SCREEN_HEIGHT - 150;
const NUM_COLUMNS = Math.floor(SCREEN_WIDTH / CELL_SIZE);
const NUM_ROWS = Math.floor(BOARD_HEIGHT / CELL_SIZE);

const Snake = () => {
  const dispatch = useDispatch();
  // Get the high score from Redux state
  const highScore = useSelector((state) => state.scores.snake);

  // State for the current game's score
  const [currentScore, setCurrentScore] = useState(0);

  const [snake, setSnake] = useState([{ x: 5, y: 5 }, { x: 5, y: 6 }]);
  const snakeRef = useRef(snake); // Ref to hold current snake state for interval

  const [food, setFood] = useState({ x: 10, y: 10 });
  const foodRef = useRef(food); // Ref to hold current food state for collision check

  const [direction, setDirection] = useState('RIGHT');
  const directionRef = useRef(direction); // Ref to hold current direction for interval

  const [gameStarted, setGameStarted] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const moveInterval = useRef(null);

  // Use a ref to store Animated.ValueXY instances, keeping it in sync with snake state
  const animatedPositionsRef = useRef([]);

  // Keep snakeRef updated whenever snake state changes
  useEffect(() => {
    snakeRef.current = snake;
    if (animatedPositionsRef.current.length !== snake.length) {
      animatedPositionsRef.current = snake.map((segment) =>
        new Animated.ValueXY({ x: segment.x * CELL_SIZE, y: segment.y * CELL_SIZE })
      );
    }
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        const dir = directionRef.current;
        if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {

          // Horizontal swipe
          if (gesture.dx > 10 && dir !== 'LEFT') {
            setDirection('RIGHT');
          } else if (gesture.dx < -10 && dir !== 'RIGHT') {
            setDirection('LEFT');
          }

        } else {
          // Vertical swipe
          if (gesture.dy > 10 && dir !== 'UP') {
            setDirection('DOWN');
          } else if (gesture.dy < -10 && dir !== 'DOWN') {
            setDirection('UP');
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    if (!gameStarted) {
      clearInterval(moveInterval.current);
      return;
    }

    moveInterval.current = setInterval(() => {
      // Get the current state values from refs to avoid stale closures
      const currentSnake = snakeRef.current;
      const currentFood = foodRef.current;
      const dir = directionRef.current;

      const head = currentSnake[0];
      let newHead;

      // Calculate new head position based on current direction
      if (dir === 'RIGHT') newHead = { x: head.x + 1, y: head.y };
      else if (dir === 'LEFT') newHead = { x: head.x - 1, y: head.y };
      else if (dir === 'UP') newHead = { x: head.x, y: head.y - 1 };
      else if (dir === 'DOWN') newHead = { x: head.x, y: head.y + 1 };

      let gameEnded = false;
      let foodEaten = false;
      let nextSnake;
      let nextFood = currentFood;

      if (isOutOfBounds(newHead) || isSelfCollision(newHead, currentSnake)) {
        gameEnded = true;
        setModalMessage('Game Over! You hit the wall or yourself.');
        Vibration.vibrate(2000);
      } else {
        // Check for food collision
        if (checkFoodCollision(newHead, currentFood)) {
          foodEaten = true;
          // Generate new food position, ensuring it's not on the snake
          let newFoodPos;
          do {
            newFoodPos = {
              x: Math.floor(Math.random() * NUM_COLUMNS),
              y: Math.floor(Math.random() * NUM_ROWS),
            };
          } while (isSelfCollision(newFoodPos, [newHead, ...currentSnake])); // Ensure new food doesn't spawn on the new snake head or body
          nextFood = newFoodPos;
          nextSnake = [newHead, ...currentSnake]; // Snake grows
          setCurrentScore((prevScore) => prevScore + 1);
        } else {
          nextSnake = [newHead, ...currentSnake.slice(0, -1)]; // Snake moves without growing
        }
      }

      // --- Perform all state updates after calculating the next state ---
      if (gameEnded) {
        setGameStarted(false); // Stop the game
        setModalVisible(true); // Show game over modal

        if (currentScore > highScore) { // Compare currentScore with Redux highScore
          dispatch(updateSnakeScore(currentScore)); // Dispatch the new high score
        }


        // Reset snake, food, and direction for the next game
        setSnake([{ x: 5, y: 5 }, { x: 5, y: 6 }]);
        setFood({ x: 10, y: 10 });
        setDirection('RIGHT');
        // Re-initialize animated positions for the reset snake
        animatedPositionsRef.current = [{ x: 5, y: 5 }, { x: 5, y: 6 }].map((segment) =>
          new Animated.ValueXY({ x: segment.x * CELL_SIZE, y: segment.y * CELL_SIZE })
        );
        setCurrentScore(0);
      } else {
        setSnake(nextSnake);

        if (foodEaten) {
          setFood(nextFood);
          animatedPositionsRef.current.unshift(
            new Animated.ValueXY({ x: newHead.x * CELL_SIZE, y: newHead.y * CELL_SIZE })
          );
        }

        nextSnake.forEach((segment, index) => {
          if (!animatedPositionsRef.current[index]) {
            animatedPositionsRef.current[index] = new Animated.ValueXY({
              x: segment.x * CELL_SIZE,
              y: segment.y * CELL_SIZE,
            });
          }
          Animated.timing(animatedPositionsRef.current[index], {
            toValue: {
              x: segment.x * CELL_SIZE,
              y: segment.y * CELL_SIZE,
            },
            duration: 180, 
            useNativeDriver: false,
          }).start();
        });
      }
    }, 200); // Game speed (interval in milliseconds)

    return () => clearInterval(moveInterval.current);
  }, [gameStarted, dispatch, currentScore, highScore]);

  // Helper function to check if snake head is out of board boundaries
  const isOutOfBounds = (head) =>
    head.x < 0 || head.y < 0 || head.x >= NUM_COLUMNS || head.y >= NUM_ROWS;

  // Helper function to check for self-collision (head hitting any part of its body)
  const isSelfCollision = (head, body) =>
    body.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y); // Exclude the head itself from collision check

  // Helper function to check if snake head has collided with food
  const checkFoodCollision = (head, currentFood) =>
    head.x === currentFood.x && head.y === currentFood.y;

  // Handles starting or restarting the game
  const handleStart = () => {
    const initialSnake = [{ x: 5, y: 5 }, { x: 5, y: 6 }];
    setSnake(initialSnake);
    animatedPositionsRef.current = initialSnake.map((segment) =>
      new Animated.ValueXY({
        x: segment.x * CELL_SIZE,
        y: segment.y * CELL_SIZE,
      })
    );
    const initialFood = { x: 10, y: 10 };
    setFood(initialFood);
    setDirection('RIGHT');
    setCurrentScore(0); 
    setGameStarted(true);
    setModalVisible(false);
  };

  const handleOption = (option) => {
    setShowDropdown(false);
    if (option === 'Reset Game') {
      handleStart();
    }
    if (option === 'Help') {
      setModalMessage('Eat the fruit. Avoid hitting the walls and yourself!');
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

          <Text style={styles.headerTitle}>Snake</Text>
          <TouchableOpacity onPress={() => setShowDropdown(!showDropdown)}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Current Score: {currentScore}</Text>
          <Text style={styles.scoreText}>High Score: {highScore}</Text>
        </View>


        {showDropdown && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.dropdownOverlay}
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdown}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleOption('Help')}
              >
                <Text style={styles.dropdownText}>Help</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleOption('Reset Game')}
              >
                <Text style={styles.dropdownText}>Reset Game</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.container}>
          {!gameStarted && (
            <TouchableOpacity style={styles.startButton} onPress={handleStart}>
              <Text style={styles.startText}>Start Game</Text>
            </TouchableOpacity>
          )}

          <View style={styles.board} {...panResponder.panHandlers}>
            {snake.map((_, index) => {
             const animatedStyle = animatedPositionsRef.current[index]
                ? animatedPositionsRef.current[index].getLayout()
                : { left: 0, top: 0 };

              return (
                <Animated.View
                  key={index}
                  style={[
                    styles.snakeSegment,
                    {
                      backgroundColor: index === 0 ? '#2ecc71' : '#27ae60',
                      ...animatedStyle, 
                    },
                  ]}
                />
              );
            })}


            <View
              style={[
                styles.food,
                {
                  left: food.x * CELL_SIZE,
                  top: food.y * CELL_SIZE,
                },
              ]}
            />
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
                onPress={handleStart}
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
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  board: {
    width: NUM_COLUMNS * CELL_SIZE,
    height: NUM_ROWS * CELL_SIZE,
    backgroundColor: '#ecf0f1',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
    overflow: 'hidden', // Ensure snake segments don't render outside board boundaries
  },
  snakeSegment: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
  },
  food: {
    position: 'absolute',
    width: CELL_SIZE,
    height: CELL_SIZE,
    backgroundColor: '#e74c3c',
    borderRadius: CELL_SIZE / 2, // Make food round
  },
  startButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginBottom: 24,
    shadowColor: '#2ecc71',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
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
    width: '80%',
    alignItems: 'center',
    marginTop: 12, // Added margin for spacing between buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalActionText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
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
    zIndex: 9,
  },
});

export default Snake;
