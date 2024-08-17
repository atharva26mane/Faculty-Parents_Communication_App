import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, FlatList, Image, StyleSheet } from 'react-native';
import { ref, push, onValue, database } from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import { launchImageLibrary } from 'react-native-image-picker';

export default function GroupChatScreen({ route }) {
  const { groupId } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (!groupId) {
      console.error('No group ID provided');
      return;
    }

    const messagesRef = ref(database(), `messages/${groupId}`);
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messagesArray = data ? Object.entries(data).map(([id, value]) => ({ id, ...value })) : [];
      setMessages(messagesArray);
    });
  }, [groupId]);

  const sendMessage = async () => {
    const currentUser = auth().currentUser;
    if (!currentUser || currentUser.role !== 'faculty') {
      alert('Only faculty members can send messages.');
      return;
    }

    if (message.trim() || image) {
      const newMessageRef = push(ref(database(), `messages/${groupId}`));

      let imageUrl = '';
      if (image) {
        const imageRef = storage().ref(`messageImages/${newMessageRef.key}.jpg`);
        await imageRef.putFile(image);
        imageUrl = await imageRef.getDownloadURL();
      }

      const newMessage = {
        text: message,
        senderId: currentUser.uid,
        timestamp: Date.now(),
        imageUrl,
      };

      await newMessageRef.set(newMessage);
      setMessage('');
      setImage(null);
    }
  };

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
        } else {
          setImage(response.assets[0].uri);
        }
      }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Text>{item.text}</Text>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.image} />}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
      {auth().currentUser?.role === 'faculty' && (
        <View style={styles.inputContainer}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Enter message"
            style={styles.input}
          />
          <Button title="Pick Image" onPress={pickImage} />
          <Button title="Send" onPress={sendMessage} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
  },
});
