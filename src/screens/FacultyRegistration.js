import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const FacultyRegistration = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to pick image from the gallery
  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets) {
        const asset = response.assets[0];
        setProfilePhoto(asset.uri);
      }
    });
  };

  // Function to upload image to Firebase Storage
  const uploadImageToStorage = async (uri, userId) => {
    if (!uri) return null;

    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`profilePhotos/${userId}/${fileName}`);

    const uploadTask = storageRef.putFile(uri);

    try {
      await uploadTask;
      const downloadURL = await storageRef.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    }
  };

  const handleRegister = async () => {
    if (name && email && password) {
      setLoading(true);
      try {
        const userCredential = await auth().createUserWithEmailAndPassword(email, password);
        const userId = userCredential.user.uid;

        // Upload the profile photo to Firebase Storage
        const profilePhotoURL = await uploadImageToStorage(profilePhoto, userId);

        // Save user data as pending faculty
        await firestore().collection('facultyRequests').doc(userId).set({
          name,
          email,
          profilePhoto: profilePhotoURL, // Save the download URL of the profile photo
          status: 'pending', // Mark as pending approval
          userId,
        });

        Alert.alert('Registration Success', 'You will be notified once your request is approved.');

        // Clear form fields
        setName('');
        setEmail('');
        setPassword('');
        setProfilePhoto(null);

        // Navigate to the waiting screen
        navigation.navigate('WaitingScreen');
      } catch (error) {
        console.error('Registration Error:', error);
        Alert.alert('Registration Error', error.message);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Error', 'All fields are required.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={pickImage}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatar} />
            ) : (
              <Image source={require('../assets/AvatarImage.png')} style={styles.avatar} />
            )}
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#AF8F6F"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#AF8F6F"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#AF8F6F"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inner: {
    padding: 20,
    justifyContent: 'center',
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F7F7FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F7F7FC',
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#AF8F6F',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#AF8F6F',
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 40,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FacultyRegistration;
