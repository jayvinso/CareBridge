import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Header from "../components/Header";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Header name="Nijaa" />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.subtitle}>Your Dashboard</Text>
          <Text style={styles.text}>
            Welcome back! You can view your MyChart data, check appointments, and explore other features here.
          </Text>
          <TouchableOpacity style={styles.redButton} onPress={() => { /* navigation or action */ }}>
            <Text style={styles.redButtonText}>View MyChart Data</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottom}>
        <TouchableOpacity style={styles.redButton} onPress={() => { /* message provider action */ }}>
          <Text style={styles.redButtonText}>Message my provider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5f7fa",
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 30,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
  },
  redButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  redButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  bottom: {
    paddingBottom: 24,
    // keep the bottom button visible and separated from content
  },
});
