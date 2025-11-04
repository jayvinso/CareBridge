import { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const placeholderMessages = [
  { id: '1', from: 'agent', text: 'Hello! How can I assist you in helping out today?' },
];


export default function ChatbotScreen() {
  const [messages, setMessages] = useState([
    { id: '1', from: 'agent', text: 'Hello! I’m the CareBridge assistant. How can I assist you today with your health needs?' },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { id: String(Date.now()), from: 'user', text: input.trim() };
    setMessages((m) => [userMsg, ...m]);
    setInput('');

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'test-user', // replace with dynamic user ID later
          text: input.trim(),
          user_info: { name: 'Yash', age: 35 }, // optional
        }),
      });

      const data = await res.json();

      const agentMsg = {
        id: String(Date.now() + 1),
        from: 'agent',
        text: data.response,
      };
      setMessages((m) => [agentMsg, ...m]);
    } catch (err) {
      console.error(err);
      const errorMsg = {
        id: String(Date.now() + 2),
        from: 'agent',
        text: 'Error contacting backend. Please try again.',
      };
      setMessages((m) => [errorMsg, ...m]);
    }
  };


  const renderItem = ({ item }) => (
    <View style={[styles.msgRow, item.from === 'user' ? styles.msgUser : styles.msgAgent]}>
      <Text style={item.from === 'user' ? styles.msgTextUser : styles.msgTextAgent}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>CareBridge Chat</Text>
        <Text style={styles.headerSubtitle}>Ask questions about your recommended care</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        inverted // newest at bottom visually by reversing data
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Type your question..."
          value={input}
          onChangeText={setInput}
          returnKeyType="send"
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: '#c41b1bff',
    paddingTop: 48,
    paddingBottom: 18,
    paddingHorizontal: 16,
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  headerSubtitle: { color: '#fff', fontSize: 13, marginTop: 6, opacity: 0.95 },
  messagesContainer: { padding: 16, paddingTop: 120 },
  msgRow: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    maxWidth: '85%',
  },
  msgAgent: {
    backgroundColor: '#f2f2f2',
    alignSelf: 'flex-start',
  },
  msgUser: {
    backgroundColor: '#c41b1bff',
    alignSelf: 'flex-end',
  },
  msgTextAgent: { color: '#222' },
  msgTextUser: { color: '#fff' },
  inputBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#fff',
    borderTopColor: '#eee',
    borderTopWidth: 1,
    zIndex: 10,
  },
  input: {
    flex: 1,
    borderRadius: 8,
    borderColor: '#eee',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#c41b1bff',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontWeight: '700' },
});
