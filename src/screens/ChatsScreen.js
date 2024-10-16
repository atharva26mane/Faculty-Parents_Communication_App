import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { useNavigation } from '@react-navigation/native';

const ChatsScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();
  const currentUser = auth().currentUser;

  useEffect(() => {
    fetchUsers().then(fetchedUsers => {
      const usersWithPhotos = fetchedUsers.map(user => ({
        ...user,
        profilePhotoUrl: `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`
      }));
      setUsers(usersWithPhotos);
    });
  }, []);

  const fetchUsers = async () => {
    const snapshot = await firestore().collection('users').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(currentUser.uid, selectedUser.id).then(setMessages);
    }
  }, [selectedUser]);

  const fetchMessages = async (userId1, userId2) => {
    const snapshot = await firestore()
      .collection('chats')
      .doc(`${userId1}_${userId2}`)
      .collection('messages')
      .orderBy('timestamp')
      .get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  };

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        sender: currentUser.uid,
        receiver: selectedUser.id,
        timestamp: firestore.FieldValue.serverTimestamp(),
      };
      await firestore()
        .collection('chats')
        .doc(`${currentUser.uid}_${selectedUser.id}`)
        .collection('messages')
        .add(newMessage);
      setMessage('');
      setMessages([...messages, newMessage]);
    }
  };

  const handleSelectUser = user => {
    setSelectedUser(user);
    fetchMessages(currentUser.uid, user.id).then(setMessages);
  };

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(text.toLowerCase())
    );
    setUsers(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      {selectedUser ? (
        <View style={styles.chatContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setSelectedUser(null)}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>{selectedUser.name}</Text>
          <FlatList
            data={messages}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => (
              <View style={[
                styles.messageBubble,
                item.sender === currentUser.uid ? styles.myMessage : styles.otherMessage
              ]}>
                <Text style={styles.messageText}>{item.text}</Text>
              </View>
            )}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
              <Text style={styles.sendText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectUser(item)} style={styles.userContainer}>
              <Image source={{ uri: item.profilePhotoUrl }} style={styles.profilePhoto} />
              <Text style={styles.userName}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  userListContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    height: 40,
    borderColor: '#DDDDDD',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  profilePhoto: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'column',
  },
  userName: {
    fontSize: 18,
    color: '#333333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#888888',
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#FFFFFF',
  },
  header: {
    fontSize: 18,
    marginBottom: 10,
    color: '#000000',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  messageText: {
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCCCCC',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  sendButton: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default ChatsScreen;
