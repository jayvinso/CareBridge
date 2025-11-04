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
  { id: '1', from: 'agent', text: 'RAG agent placeholder, answers will appear here.' },
  { id: '2', from: 'user', text: 'Hi! How do I schedule my preventive exam?' },
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState(placeholderMessages);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: String(Date.now()), from: 'user', text: input.trim() };
    setMessages((m) => [newMsg, ...m]);
    setInput('');
    // placeholder: when RAG is added, send `input` to the agent and append response
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
