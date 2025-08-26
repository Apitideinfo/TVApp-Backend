import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '../context/UserContext';
import { useAdmin } from '../context/AdminContext';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'worker' | 'client' | 'admin' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserRole, setIsAuthenticated, setUserData, setAuthToken } = useUser();
  const { login: adminLogin } = useAdmin();

  const renderRoleButton = (role: 'worker' | 'client' | 'admin', label: string) => (
    <TouchableOpacity
      style={[
        styles.roleButton,
        selectedRole === role && styles.roleButtonSelected,
      ]}
      onPress={() => setSelectedRole(role)}
    >
      <Text style={[
        styles.roleButtonText,
        selectedRole === role && styles.roleButtonTextSelected
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const handleLogin = async () => {
    if (!email || !password || !selectedRole) {
      Alert.alert('Error', 'Please fill in all fields and select a role');
      return;
    }

    if (selectedRole !== 'admin' && !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      if (selectedRole === 'admin') {
        // Handle admin login
        const response = await adminLogin({ admin_id: email, password });
        setAuthToken(response.data.token);
        setUserData(response.data.admin);
        setUserRole('admin');
        setIsAuthenticated(true);
      } else {
        // Handle worker/client login (existing logic)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setUserRole(selectedRole);
        setIsAuthenticated(true);
      }
      
      Alert.alert('Success', 'Login successful!', [
        {
          text: 'OK',
          onPress: () => {
            // Navigate to appropriate screen based on role
            if (selectedRole === 'admin') {
              navigation.replace('Admin');
            } else if (selectedRole === 'worker') {
              navigation.replace('Dashboard');
            } else {
              navigation.replace('ClientHome');
            }
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#6c757d"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#6c757d"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select Role</Text>
            <View style={styles.roleContainer}>
              {renderRoleButton('worker', 'Worker')}
              {renderRoleButton('client', 'Client')}
              {renderRoleButton('admin', 'Admin')}
            </View>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#212529',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 15,
    fontSize: 16,
    color: '#212529',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    width: '32%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  roleButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  roleButtonTextSelected: {
    color: '#ffffff',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#007bff',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#007bff',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: '#6c757d',
    fontSize: 16,
  },
  signUpText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen; 