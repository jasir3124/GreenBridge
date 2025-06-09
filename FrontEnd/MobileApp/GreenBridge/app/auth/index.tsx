import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Leaf, Mail, Lock, User } from 'lucide-react-native';
import UserExistsModal from '../components/ExistingUserModal';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !fullName)) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    let timeoutTriggered = false;

    // 7-second timeout to show "took too long" modal
    const timeoutId = setTimeout(() => {
      timeoutTriggered = true;
      setLoading(false);
      setModalMessage('Sorry, it took too long. Please try again.');
      setShowModal(true);
    }, 7000);

    try {
      let success = false;
      if (isLogin) {
        success = await login(email, password);
      } else {
        success = await register(email, password, fullName);
      }

      clearTimeout(timeoutId);

      if (timeoutTriggered) return; // Timeout already fired, ignore late response

      if (success) {
        router.replace('/(tabs)');
      } else {
        if (!isLogin) {
          // User already exists scenario
          setModalMessage('The email address you entered is already registered.');
          setShowModal(true);
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (timeoutTriggered) return;

      Alert.alert('Error', 'Something went wrong');
    } finally {
      if (!timeoutTriggered) setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@greenbridge.eu');
    setPassword('demo123');
  };

  return (
      <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <LinearGradient colors={['#22C55E', '#16A34A', '#15803D']} style={styles.gradient}>
          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <Leaf color="white" size={48} strokeWidth={2} />
              </View>
              <Text style={styles.title}>GreenBridge</Text>
              <Text style={styles.subtitle}>Connecting youth with environmental action</Text>
            </View>

            <View style={styles.form}>
              {!isLogin && (
                  <View style={styles.inputContainer}>
                    <User color="#16A34A" size={20} />
                    <TextInput
                        style={styles.input}
                        placeholder="Full Name"
                        value={fullName}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                  </View>
              )}

              <View style={styles.inputContainer}>
                <Mail color="#16A34A" size={20} />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Lock color="#16A34A" size={20} />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.submitButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>}
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchButton} onPress={() => setIsLogin(!isLogin)}>
                <Text style={styles.switchButtonText}>
                  {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
                </Text>
              </TouchableOpacity>

              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Try Demo:</Text>
                <TouchableOpacity style={styles.demoButton} onPress={fillDemoCredentials}>
                  <Text style={styles.demoButtonText}>Fill Demo Credentials</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </LinearGradient>

        <UserExistsModal visible={showModal} onClose={() => setShowModal(false)} message={modalMessage} />
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 48 },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 32, fontFamily: 'Inter-Bold', color: 'white', marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  form: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  switchButtonText: {
    color: '#16A34A',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  demoContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  demoTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 12,
  },
  demoButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  demoButtonText: {
    color: '#16A34A',
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
});
