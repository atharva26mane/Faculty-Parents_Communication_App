import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SearchBar, ListItem, Avatar } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export default function GroupsScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const groupsCollection = await firestore().collection('groups').get();
        const groupsArray = groupsCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(groupsArray);
        setFilteredGroups(groupsArray);
      } catch (error) {
        console.error("Error fetching groups:", error);
      }
    };

    fetchGroups();

    const unsubscribeAuth = auth().onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        console.log('Current user:', user); // Debug log
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const updateSearch = (searchText) => {
    setSearch(searchText);
    if (searchText) {
      setFilteredGroups(groups.filter(group => group.name.toLowerCase().includes(searchText.toLowerCase())));
    } else {
      setFilteredGroups(groups);
    }
  };

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('GroupDetails', { groupId: item.id })}>
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

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text>Loading or Please log in</Text>
      </View>
    );
  }

  console.log('User role:', currentUser.role); // Debug log

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
        keyExtractor={item => item.id}
        renderItem={renderGroupItem}
      />
      {currentUser.role === 'faculty' && ( // Ensure that currentUser exists before checking the role
        <TouchableOpacity
          style={styles.createGroupButton}
          onPress={() => navigation.navigate('CreateGroup')}
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
