import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, SafeAreaView, Image, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker'; // For image picker
import storage from '@react-native-firebase/storage'; // Firebase storage for uploading the image
import firestore from '@react-native-firebase/firestore'; // Firebase Firestore for storing user data
import auth from '@react-native-firebase/auth'; // Firebase auth for handling user authentication

export default function ParentRegistration({ navigation }) {
  const [parentName, setParentName] = useState('');
  const [parentPhoneNumber, setParentPhoneNumber] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  // Function to upload image to Firebase Storage and get the download URL
  const uploadImage = async (userId) => {
    if (profilePhoto == null) {
      Alert.alert('Please select a profile photo.');
      return null;
    }

    const fileName = profilePhoto.substring(profilePhoto.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`profilePhotos/${userId}/${fileName}`);

    setUploading(true);
    try {
      await storageRef.putFile(profilePhoto);
      const downloadURL = await storageRef.getDownloadURL();
      setUploading(false);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image: ", error);
      setUploading(false);
      return null;
    }
  };

  // Function to save user data to Firestore
  const saveData = async (uid, imageUrl) => {
    const userData = {
      parentName,
      parentPhoneNumber,
      studentName,
      studentEmail,
      imageUrl,
      role: 'parent',  // Ensuring the role is 'parent' for correct workflow
      uid
    };

    try {
      await firestore().collection('users').doc(uid).set(userData);
      Alert.alert('Registration successful!');
      navigation.replace('ParentTabs'); // Navigate to ParentTabs after registration
    } catch (error) {
      console.error("Error saving data: ", error);
      Alert.alert('Registration failed. Please try again.');
    }
  };

  // Handle Save Button Press
  const handleSave = async () => {
    try {
      // Create the user account using Firebase auth
      const userCredential = await auth().createUserWithEmailAndPassword(studentEmail, password);
      const uid = userCredential.user.uid;

      // Upload the profile photo and get the URL
      const imageUrl = await uploadImage(uid);
      if (!imageUrl) return;

      // Save the user data in Firestore
      await saveData(uid, imageUrl);
    } catch (error) {
      console.error("Error creating user: ", error);
      Alert.alert('Registration failed. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inner}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {profilePhoto ? (
              <Image source={{ uri: profilePhoto }} style={styles.avatar} />
            ) : (
              <Image source={require('../assets/AvatarImage.png')} style={styles.avatar} />
            )}
          </TouchableOpacity>

          <TextInput
            placeholder="Parent's Name"
            placeholderTextColor="#AF8F6F"
            style={styles.input}
            value={parentName}
            onChangeText={setParentName}
          />
          <TextInput
            placeholder="Parent's Phone Number"
            placeholderTextColor="#AF8F6F"
            style={styles.input}
            value={parentPhoneNumber}
            onChangeText={setParentPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            placeholder="Student's Name"
            placeholderTextColor="#AF8F6F"
            style={styles.input}
            value={studentName}
            onChangeText={setStudentName}
          />
          <TextInput
            placeholder="Student's Email"
            placeholderTextColor="#AF8F6F"
            style={styles.input}
            value={studentEmail}
            onChangeText={setStudentEmail}
            keyboardType="email-address"
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#AF8F6F"
            style={styles.input}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={uploading}>
            <Text style={styles.saveButtonText}>{uploading ? 'Uploading...' : 'Save'}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
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
  saveButton: {
    backgroundColor: '#AF8F6F',
    borderRadius: 30,
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 40,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
