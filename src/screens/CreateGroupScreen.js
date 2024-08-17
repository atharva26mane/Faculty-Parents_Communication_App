import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, Image, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';

export default function CreateGroupScreen({ navigation }) {
  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = await firestore().collection('users').get();
      const usersArray = usersCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersArray);
    };

    fetchUsers();
  }, []);

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 1024,
        maxHeight: 1024,
      },
      (response) => {
        if (response.didCancel || response.error) {
          console.log('User cancelled image picker or an error occurred');
        } else if (response.assets && response.assets.length > 0) {
          setGroupImage(response.assets[0].uri);
        }
      }
    );
  };

  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const createGroup = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser) {
      alert('User not authenticated');
      return;
    }

    const userDoc = await firestore().collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    if (userData.role !== 'faculty') {
      alert('Only faculty members can create groups.');
      return;
    }

    const newGroupRef = firestore().collection('groups').doc();
    let imageUrl = '';
    if (groupImage) {
      const imageRef = storage().ref(`groupImages/${newGroupRef.id}.jpg`);
      await imageRef.putFile(groupImage);
      imageUrl = await imageRef.getDownloadURL();
    }

    const groupData = {
      name: groupName,
      image: imageUrl,
      members: selectedUsers.reduce((acc, userId) => {
        const user = users.find(u => u.id === userId);
        return { ...acc, [userId]: user.role };
      }, {}),
      createdBy: currentUser.uid,
    };

    await newGroupRef.set(groupData);

    // Ensure the created group is visible to all users, including parents
    const usersCollection = await firestore().collection('users').get();
    const usersArray = usersCollection.docs.map(doc => doc.id);
    await Promise.all(usersArray.map(async (userId) => {
      if (userId !== currentUser.uid) {
        const userRef = firestore().collection('parentGroups').doc(userId);
        await userRef.update({
          [newGroupRef.id]: groupData,
        });
      }
    }));

    navigation.navigate('GroupDetails', { groupId: newGroupRef.id });
  };

  return (
    <View style={styles.container}>
      <Text>Group Name:</Text>
      <TextInput
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Enter group name"
        style={styles.input}
      />
      <Button title="Pick Group Image" onPress={pickImage} />
      {groupImage && <Image source={{ uri: groupImage }} style={{ width: 200, height: 200 }} />}
      <Text>Select Users:</Text>
      <FlatList
        data={users.filter(user => user.role === 'faculty' || user.role === 'parent')}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleUserSelection(item.id)} style={styles.userItem}>
            <Text>{item.name} ({item.role})</Text>
            {selectedUsers.includes(item.id) && <Text style={styles.selectedText}>Selected</Text>}
          </TouchableOpacity>
        )}
      />
      <Button title="Create Group" onPress={createGroup} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  selectedText: {
    color: 'green',
  },
});
