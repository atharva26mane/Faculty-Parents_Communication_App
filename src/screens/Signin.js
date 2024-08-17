import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Signin({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignin = async () => {
    try {
      // Sign in with email and password
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const role = userData?.role || null;

        // Navigate to the appropriate tabs based on the role
        if (role === 'admin') {
          navigation.replace('AdminScreen');  // Navigate to AdminScreen if the user is an admin
        } else if (role === 'faculty') {
          navigation.replace('FacultyTabs');  // Navigate to FacultyTabs if the user is a faculty member
        } else if (role === 'parent') {
          navigation.replace('ParentTabs');  // Navigate to ParentTabs if the user is a parent
        } else {
          setError('Unknown role. Please contact support.');
        }
      } else {
        setError('No user data found.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Let's Sign you in</Text>
        <Text style={styles.subtitle}>Welcome Back!</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          placeholder="Email ID"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Image
          source={require('../assets/bloggingbro.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <TouchableOpacity onPress={() => navigation.navigate('ChooseUser')}>
          <Text style={styles.registerText}>
            Don't have an account? <Text style={styles.registerLink}>Register</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    backgroundColor: '#F7F7FC',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#f7f7f7',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 30,
  },
  registerLink: {
    color: '#c79b6d',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#b38b67',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
