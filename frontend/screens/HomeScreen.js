import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const placeholderGaps = [
  {
    id: '1',
    title: 'Annual preventive Exam',
    subtitle: 'Yearly Checkup',
  },
  // Add more items as needed later
];

export default function HomeScreen() {
  const renderGapItem = ({ item }) => (
    <View style={styles.gapItem}>
      <Text style={styles.gapTitle}>{item.title}</Text>
      <Text style={styles.gapSubtitle}>{item.subtitle}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.redButton}>
          <Text style={styles.buttonText}>Learn More</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.redButton}>
          <Text style={styles.buttonText}>Schedule</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.redButton}>
          <Text style={styles.buttonText}>Estimate Cost</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>CareBridge</Text>
      </View>

      {/* Welcome message */}
      <Text style={styles.welcomeText}>Welcome Back, User!</Text>

      {/* Pending gaps count */}
      <Text style={styles.pendingText}>You have 8 pending gaps to address</Text>

      {/* List of gaps */}
      <FlatList
        data={placeholderGaps}
        keyExtractor={(item) => item.id}
        renderItem={renderGapItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom-right help text above the navigation bar */}
      <View style={styles.floatingHelp} pointerEvents="box-none">
        <Text style={styles.askTitle}>Ask a Question Now</Text>
        <Text style={styles.askSubtitle}>Get real-time answers to your questions about recommended care</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    backgroundColor: '#c41b1bff',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: 'bold'
  },
  pendingText: {
    fontSize: 16,
    marginBottom: 16,
    color: '#555',
  },
  listContainer: {
    paddingBottom: 20,
  },
  gapItem: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  gapTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  gapSubtitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  redButton: {
    backgroundColor: '#c41b1bff',
    paddingVertical: 10,
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  floatingHelp: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
    maxWidth: '72%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 6,
  },
  askTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#c41b1bff',
    marginBottom: 4,
  },
  askSubtitle: {
    fontSize: 12,
    color: '#444',
    textAlign: 'center',
  },
});
