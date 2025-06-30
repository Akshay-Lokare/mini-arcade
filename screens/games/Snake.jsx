import React, { useEffect, useRef, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';

const CELL_SIZE = 20;
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const NUM_COLUMNS = Math.floor(SCREEN_WIDTH / CELL_SIZE);
const NUM_ROWS = Math.floor((SCREEN_HEIGHT - 100) / CELL_SIZE);

const Snake = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }, { x: 5, y: 6 }]);
  const [food, setFood] = useState({ x: 10, y: 10 });
  const foodRef = useRef(food);
  const [direction, setDirection] = useState('RIGHT');
  const [gameStarted, setGameStarted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigation = useNavigation();
  const moveInterval = useRef(null);
  const directionRef = useRef(direction);
  const animatedPositionsRef = useRef([]); // NEW: animated positions

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        const dir = directionRef.current;
        if (Math.abs(gesture.dx) > Math.abs(gesture.dy)) {
          if (gesture.dx > 10 && dir !== 'LEFT') {
            directionRef.current = 'RIGHT';
            setDirection('RIGHT');
          } else if (gesture.dx < -10 && dir !== 'RIGHT') {
            directionRef.current = 'LEFT';
            setDirection('LEFT');
          }
        } else {
          if (gesture.dy > 10 && dir !== 'UP') {
            directionRef.current = 'DOWN';
            setDirection('DOWN');
          } else if (gesture.dy < -10 && dir !== 'DOWN') {
            directionRef.current = 'UP';
            setDirection('UP');
          }
        }
      },
    })
  ).current;

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    if (!gameStarted) return;

    moveInterval.current = setInterval(() => {
      setSnake((prev) => {
        const head = prev[0];
        let newHead;
        const dir = directionRef.current;

        if (dir === 'RIGHT') newHead = { x: head.x + 1, y: head.y };
        if (dir === 'LEFT') newHead = { x: head.x - 1, y: head.y };
        if (dir === 'UP') newHead = { x: head.x, y: head.y - 1 };
        if (dir === 'DOWN') newHead = { x: head.x, y: head.y + 1 };

        if (isOutOfBounds(newHead) || isSelfCollision(newHead, prev)) {
          setGameStarted(false);
          setShowModal(true);
          return [{ x: 5, y: 5 }, { x: 5, y: 6 }];
        }

        let newSnake;
        if (checkFoodCollision(newHead)) {
          const newFood = {
            x: Math.floor(Math.random() * NUM_COLUMNS),
            y: Math.floor(Math.random() * NUM_ROWS),
          };
          setFood(newFood);
          newSnake = [newHead, ...prev];
          animatedPositionsRef.current.unshift(
            new Animated.ValueXY({ x: newHead.x * CELL_SIZE, y: newHead.y * CELL_SIZE })
          );
        } else {
          newSnake = [newHead, ...prev.slice(0, -1)];
        }

        newSnake.forEach((segment, index) => {
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

        return newSnake;
      });
    }, 200);

    return () => clearInterval(moveInterval.current);
  }, [gameStarted]);

  const isOutOfBounds = (head) =>
    head.x < 0 || head.y < 0 || head.x >= NUM_COLUMNS || head.y >= NUM_ROWS;

  const isSelfCollision = (head, body) =>
    body.some((segment) => segment.x === head.x && segment.y === head.y);

  const checkFoodCollision = (head) =>
    head.x === foodRef.current.x && head.y === foodRef.current.y;

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
    foodRef.current = initialFood;
    setDirection('RIGHT');
    setGameStarted(true);
    setShowModal(false);
  };

  const handleOption = (option) => {
    setShowDropdown(false);
    if (option === 'Reset Game') handleStart();
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

        {showDropdown && (
          <TouchableOpacity
            activeOpacity={1}
            style={styles.dropdownOverlay}
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdown}>
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
            {snake.map((_, index) => (
              <Animated.View
                key={index}
                style={{
                  position: 'absolute',
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: index === 0 ? '#2ecc71' : '#27ae60',
                  transform:
                    animatedPositionsRef.current[index]?.getTranslateTransform() || [],
                }}
              />
            ))}

            <View
              style={{
                position: 'absolute',
                width: CELL_SIZE,
                height: CELL_SIZE,
                backgroundColor: '#e74c3c',
                left: food.x * CELL_SIZE,
                top: food.y * CELL_SIZE,
              }}
            />
          </View>
        </View>

        <Modal transparent={true} visible={showModal} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalText}>Game Over!</Text>
              <TouchableOpacity
                onPress={handleStart}
                style={[styles.modalActionButton, { backgroundColor: '#27ae60' }]}
              >
                <Text style={styles.modalActionText}>Play Again</Text>
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
  board: {
    width: NUM_COLUMNS * CELL_SIZE,
    height: NUM_ROWS * CELL_SIZE,
    backgroundColor: '#ecf0f1',
    borderWidth: 2,
    borderColor: '#333',
    position: 'relative',
  },
  startButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    marginBottom: 24,
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
  },
  modalActionText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
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
