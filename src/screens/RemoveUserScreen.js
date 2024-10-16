import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function UserListScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore().collection('users')
      .onSnapshot(snapshot => {
        const newUsers = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(newUsers);
        setLoading(false);
      }, error => {
        console.error("Error fetching users: ", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleRemove = async (user) => {
    try {
      // Move user to 'removedusers' collection
      await firestore().collection('removedusers').doc(user.id).set(user);

      // Remove user from 'users' collection
      await firestore().collection('users').doc(user.id).delete();

      console.log("Removed:", user.name);
    } catch (error) {
      console.error("Error removing user: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: item.profilePhoto }} 
          style={styles.profileImage} 
          defaultSource={require('../assets/default_profile.png')} // Fallback image
        />
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemove(item)}
      >
        <Text style={styles.buttonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={users}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 15, // Increase padding
    justifyContent: 'space-between', // Ensures buttons are aligned to the right
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Ensures image and name are centered vertically
  },
  profileImage: {
    width: 60, // Set size of the profile image
    height: 60,
    borderRadius: 30, // Adjust borderRadius to half of the width/height
    backgroundColor: '#e3e3e3',
    marginRight: 15, // Spacing between image and text
  },
  name: {
    fontSize: 18, // Set font size
    fontWeight: 'bold',
    color: '#000',
  },
  removeButton: {
    backgroundColor: '#B0875B', // Brown background color for "Remove" button
    borderRadius: 8,
    paddingVertical: 12, // Padding for the button
    paddingHorizontal: 25,
    marginHorizontal: 8, // Spacing between buttons
  },
  buttonText: {
    color: '#FFF', // White font color for the button text
    fontWeight: '600',
    fontSize: 16, // Font size of button text
  },
});
