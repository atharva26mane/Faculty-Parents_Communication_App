import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function ChatScreen({ route, navigation }) {
  const { faculty } = route.params;
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async () => {
    setLoading(true);
    try {
      await firestore().collection('chats').add({
        text: message,
        sender: 'parent', // assuming parent's role is known
        receiver: faculty.id,
        timestamp: firestore.FieldValue.serverTimestamp(),
      });
      setMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const viewFacultyInfo = () => {
    navigation.navigate('FacultyInfo', { faculty });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.infoButton} onPress={viewFacultyInfo}>
        <Text style={styles.infoButtonText}>View Faculty Info</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <Button
        title={loading ? "Sending..." : "Send"}
        onPress={sendMessage}
        disabled={loading}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 100,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
  },
  infoButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  infoButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});
