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
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      const userDoc = await firestore().collection('users').doc(user.uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        const role = userData?.role || null;

        if (role === 'admin') {
          navigation.replace('AdminScreen');
        } else if (role === 'faculty') {
          navigation.replace('FacultyTabs');
        } else if (role === 'parent') {
          navigation.replace('ParentTabs');
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
          placeholderTextColor="#B08968"  // Set the placeholder color to brown
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#B08968"  // Set the placeholder color to brown
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#7D7D7D',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#F7F7FC',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 0,
    color: '#000', // Ensure the text color is visible
  },
  button: {
    backgroundColor: '#B08968',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  registerText: {
    marginTop: 15,
    textAlign: 'center',
    color: '#7D7D7D',
  },
  registerLink: {
    color: '#B08968',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
});
