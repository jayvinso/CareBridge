import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';


// Password is always obfuscated; no icon mock is needed.

// Get screen dimensions
const { width, height } = Dimensions.get('window');

// Define screen states
type Screen = 'landing' | 'login' | 'signup';

/**
 * The main application component.
 * Manages screen navigation and state.
 */
const App = () => {
  // State for navigation
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');

  // State for login form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- Event Handlers ---

  const handleGoToLogin = () => {
    setCurrentScreen('login');
  };

  const handleGoToSignUp = () => {
    setCurrentScreen('signup');
  };

  const handleGoBack = () => {
    // Reset fields when going back
    setEmail('');
    setPassword('');
    setCurrentScreen('landing');
  };

  // Password visibility is not toggleable; always obfuscated.

  /**
   * Placeholder for the sign-in logic.
   * Does nothing as requested.
   */
  const handleSignIn = () => {
    console.log('Sign in pressed with:', { email, password });
    // Sign-in logic would go here
  };

  // --- Render Functions ---

  /**
   * Renders the initial landing screen with Login/Sign Up options.
   */
  const renderLandingScreen = () => (
    <View style={styles.landingContainer}>
      <Text style={styles.title}>Care Bridge</Text>
      <Text style={styles.subtitle}>Connecting Care. Simply.</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleGoToLogin}
        >
          <Text style={styles.primaryButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleGoToSignUp}
        >
          <Text style={styles.secondaryButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Renders the login screen based on the screenshot.
   */
  const renderLoginScreen = () => (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.loginHeader}>
        {/* Simple placeholder icon */}
        <View style={styles.iconWrapper}>
          <Image
            source={require('../../assets/images/care_bridge_logo.png')}
            style={styles.iconImage}
          />
        </View>
        <Text style={styles.loginTitle}>Welcome back</Text>
        <Text style={styles.loginSubtitle}>
          Please enter your details to sign in.
        </Text>
      </View>

      {/* Form inputs */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email..."
          placeholderTextColor="#8E8E93"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="Password"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true} // Always obfuscated
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, styles.signInButton]}
          onPress={handleSignIn}
        >
          <Text style={styles.primaryButtonText}>Sign in</Text>
        </TouchableOpacity>
      </View>

      {/* Back button */}
      <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  /**
   * Renders a placeholder screen for sign-up.
   */
  const renderSignUpScreen = () => (
    <View style={styles.landingContainer}>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.subtitle}>This screen is coming soon!</Text>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton, { marginTop: 30 }]}
        onPress={handleGoBack}
      >
        <Text style={styles.secondaryButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Selects which screen to render based on state.
   */
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'login':
        return renderLoginScreen();
      case 'signup':
        return renderSignUpScreen();
      case 'landing':
      default:
        return renderLandingScreen();
    }
  };

  // --- Main Component Return ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9F9F9" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {renderCurrentScreen()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  // --- Landing Screen Styles ---
  landingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    marginBottom: 60,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#007AFF', // A modern blue
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#E5E5EA', // A light grey
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 17,
    fontWeight: '600',
  },
  // --- Login Screen Styles ---
  loginHeader: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 54,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#1C1C1E',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    marginTop: 0,
  },
  signInButton: {
    marginTop: 24,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '500',
  },
  // This styles your actual image file
  iconImage: {
    width: 60, // Make it a bit smaller than the wrapper
    height: 60,
    // 'contain' ensures your whole image fits inside,
    // without being stretched or cropped.
    resizeMode: 'contain',
    // If your image file is square, this will make it circular
    borderRadius: 30, // Half of the width/height
  },
});

export default App;
