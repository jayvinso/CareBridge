import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LockScreen({ onSuccess }) {
  const notifySuccess = typeof onSuccess === 'function' ? onSuccess : () => {};
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = () => {
    if (isLoading) return;
    setIsLoading(true);
    // Simulate a tiny delay for UX
    setTimeout(() => {
      const ok = username.trim().toLowerCase() === 'jvinson' && password === '1234';
      setIsLoading(false);
      if (ok) {
        notifySuccess();
      } else {
        Alert.alert('Sign in failed', 'Invalid username or password.');
      }
    }, 450);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <Text style={styles.brand}>CareBridge</Text>
        <Text style={styles.subtitle}>Welcome back</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter username"
          value={username}
          onChangeText={setUsername}
          returnKeyType="next"
        />

        <Text style={[styles.label, { marginTop: 10 }]}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleSignIn}
        />

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Signing in…' : 'Sign In'}</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    paddingTop: 72,
    paddingBottom: 24,
    alignItems: 'center',
    backgroundColor: '#c41b1bff',
  },
  brand: { color: '#fff', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#fff', fontSize: 13, marginTop: 6, opacity: 0.95 },
  form: { padding: 20 },
  label: { fontSize: 14, color: '#444', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#c41b1bff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  helper: { color: '#666', fontSize: 12, marginTop: 12, textAlign: 'center' },
});
