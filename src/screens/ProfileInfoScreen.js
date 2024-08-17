import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const ProfileInfoScreen = () => {
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [name, setName] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth().currentUser;
      setUser(currentUser);
      const doc = await firestore().collection('parents').doc(currentUser.uid).get();
      const data = doc.data();
      setName(data?.parentName);
      setProfilePhoto(data?.imageUrl);
    };

    fetchData();
  }, []);

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel || response.error) return;

      const uri = response.assets[0].uri;
      const fileName = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = storage().ref(`profile_photos/${fileName}`);

      await storageRef.putFile(uri);
      const downloadURL = await storageRef.getDownloadURL();
      setProfilePhoto(downloadURL);

      // Update Firestore
      await firestore().collection('parents').doc(user.uid).update({ imageUrl: downloadURL });
    });
  };

  const handleSave = async () => {
    if (name) {
      await firestore().collection('parents').doc(user.uid).update({ parentName: name });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={profilePhoto ? { uri: profilePhoto } : require('../assets/AvatarImage.png')}
          style={styles.avatar}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <Button title="Save Changes" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
    alignSelf: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});

export default ProfileInfoScreen;
