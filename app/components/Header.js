import { StyleSheet, Text, View } from "react-native";

export default function Header({ name }) {
  return (
    <View style={styles.header}>
      <Text style={styles.greeting}>Welcome back, {name}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    backgroundColor: "#ff3b30", // red header
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  greeting: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff", // white text on red
  },
});
