import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

// Helper: Format snake time as MM:SS
function formatTime(seconds = 0) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

const HighScoreScreen = () => {
  const navigation = useNavigation();
  const { snake, memory, rps } = useSelector((state) => state.scores);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={22} color="#888" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>High Scores</Text>
        </View>


        <View style={styles.scoreList}>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardTitle}>SNAKE</Text>
            <Text style={styles.scoreCardValue}>{snake || 0}</Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardTitle}>MEMORY</Text>
            <Text style={styles.scoreCardValue}>{formatTime(memory || 0)}</Text>
          </View>

          <View style={styles.scoreCard}>
            <Text style={styles.scoreCardTitle}>RPS</Text>
            <Text style={styles.scoreCardValue}>{rps || 0}</Text>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: '#fff0f0',
  },
  backButton: {
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e76f51',
    textAlign: 'center',
    flex: 1,
  },
  scoreList: {
    marginTop: 20,
    paddingHorizontal: 24,
    width: '100%',
  },
  scoreCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f2dcdc',
    padding: 20,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scoreCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e76f51',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  scoreCardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#444',
  },
});

export default HighScoreScreen;
