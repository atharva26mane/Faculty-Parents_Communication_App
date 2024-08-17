import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchBar, ListItem, Avatar } from 'react-native-elements';
import { ref, onValue } from 'firebase/database';  // Correct import from Firebase SDK
import { database } from './firebaseConfig';  // Import the initialized database from your firebaseConfig.js
import auth from '@react-native-firebase/auth';

export default function GroupsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // State for the current user

  useEffect(() => {
    const groupsRef = ref(database, 'groups'); // Reference your Realtime Database

    onValue(groupsRef, (snapshot) => {
      const data = snapshot.val();
      const groupsArray = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
      setGroups(groupsArray);
      setFilteredGroups(groupsArray);
    });

    // Listen for authentication state changes and update the current user
    const unsubscribe = auth().onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return unsubscribe; // Cleanup the listener on component unmount
  }, []);

  const updateSearch = (searchText) => {
    setSearch(searchText);
    if (searchText) {
      setFilteredGroups(groups.filter((group) => group.name.toLowerCase().includes(searchText.toLowerCase())));
    } else {
      setFilteredGroups(groups);
    }
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('Chat', { groupId: item.id })}>
      <ListItem bottomDivider>
        <Avatar
          rounded
          source={item.image ? { uri: item.image } : require('../assets/default-avatar.png')}
          size="medium"
        />
        <ListItem.Content>
          <ListItem.Title>{item.name}</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </TouchableOpacity>
  );

  // If the current user is null, show a loading state or prompt to login
  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>Loading or Please log in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search"
        onChangeText={updateSearch}
        value={search}
        containerStyle={styles.searchContainer}
        inputContainerStyle={styles.searchInput}
      />
      <FlatList
        data={filteredGroups}
        keyExtractor={(item) => item.id}
        renderItem={renderGroupItem}
      />
      {currentUser.role === 'faculty' && ( // Ensure that currentUser exists before checking the role
        <TouchableOpacity
          style={styles.createGroupButton}
          onPress={() => navigation.navigate('Create Group')}
        >
          <Text style={styles.buttonText}>Create Group</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
  },
  searchInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  createGroupButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
