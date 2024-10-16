import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import GestureRecognizer from 'react-native-swipe-gestures';
import DocumentUploader from './DocumentUploader'; // Import the new component

export default function ChatScreen({ route, navigation }) {
  const { faculty } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');

  useEffect(() => {
    navigation.setOptions({
      tabBarVisible: false,
      headerShown: false,
    });

    const fetchProfilePhoto = async () => {
      try {
        const userDoc = await firestore().collection('users').doc(faculty.id).get();
        const { profilePhoto } = userDoc.data();
        setProfilePhotoUrl(profilePhoto);
      } catch (error) {
        console.error('Error fetching profile photo:', error);
      }
    };

    fetchProfilePhoto();

    const unsubscribe = firestore()
      .collection('chats')
      .where('receiver', '==', faculty.id)
      .orderBy('timestamp', 'asc')
      .onSnapshot((querySnapshot) => {
        const msgs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [faculty.id, navigation]);

  const sendMessage = async (fileUri = null, fileType = 'text', fileName = '') => {
    setLoading(true);
    try {
      const messageData = {
        text: fileType === 'text' ? message : null,
        sender: 'parent',
        receiver: faculty.id,
        timestamp: firestore.FieldValue.serverTimestamp(),
        replyTo: replyTo ? replyTo.id : null,
        fileUrl: fileUri,
        fileType,
        fileName,
      };
      await firestore().collection('chats').add(messageData);
      setMessage('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDocumentSent = (fileUrl, fileName) => {
    sendMessage(fileUrl, 'document', fileName);
  };

  const viewFacultyInfo = () => {
    navigation.navigate('FacultyInfo', { faculty });
  };

  return (
    <View style={styles.container}>
      {/* Header with profile */}
      <View style={styles.header}>
        <TouchableOpacity onPress={viewFacultyInfo} style={styles.profileContainer}>
          <Image source={{ uri: profilePhotoUrl }} style={styles.profileImage} />
          <Text style={styles.profileName}>{faculty.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Chat messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <GestureRecognizer
            style={[
              styles.messageContainer,
              item.sender === 'parent' ? styles.sentMessage : styles.receivedMessage,
            ]}
            onSwipeRight={() => setReplyTo(item)}
          >
            <View>
              {item.replyTo && (
                <Text style={styles.replyText}>
                  Replying to: {messages.find((msg) => msg.id === item.replyTo)?.text}
                </Text>
              )}
              <View
                style={[
                  styles.messageBubble,
                  item.sender === 'parent' ? styles.sentBubble : styles.receivedBubble,
                ]}
              >
                {item.fileType === 'image' ? (
                  <Image source={{ uri: item.fileUrl }} style={styles.sentImage} />
                ) : item.fileType === 'document' ? (
                  <View style={styles.documentContainer}>
                    <Image source={require('../assets/pdf-icon.png')} style={styles.documentIcon} />
                    <Text style={styles.documentText}>{item.fileName || 'Document'}</Text>
                  </View>
                ) : (
                  <Text style={item.sender === 'parent' ? styles.sentText : styles.receivedText}>
                    {item.text}
                  </Text>
                )}
                <Text style={styles.timestamp}>
                  {item.timestamp?.toDate().toLocaleTimeString() || ''}
                </Text>
              </View>
            </View>
          </GestureRecognizer>
        )}
      />

      {/* Reply indicator */}
      {replyTo && (
        <View style={styles.replyIndicatorContainer}>
          <Text style={styles.replyIndicator}>Replying to: {replyTo.text}</Text>
          <TouchableOpacity onPress={() => setReplyTo(null)}>
            <Text style={styles.closeReply}>X</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input bar */}
      <View style={styles.inputBar}>
        {/* Document uploader */}
        <DocumentUploader onDocumentSent={handleDocumentSent} />

        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#888"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity onPress={() => sendMessage()} disabled={loading}>
          <Image source={require('../assets/send.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: { height: 70, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, backgroundColor: '#1B2B48' },
  profileContainer: { flexDirection: 'row', alignItems: 'center' },
  profileImage: { width: 50, height: 50, borderRadius: 25 },
  profileName: { color: 'white', fontSize: 18, marginLeft: 10 },
  messageContainer: { padding: 10, marginVertical: 5 },
  sentMessage: { alignItems: 'flex-end' },
  receivedMessage: { alignItems: 'flex-start' },
  messageBubble: { padding: 10, borderRadius: 10 },
  sentBubble: { backgroundColor: '#DDF4FF' },
  receivedBubble: { backgroundColor: '#F0F0F0' },
  sentText: { color: '#000' },
  receivedText: { color: '#000' },
  sentImage: { width: 150, height: 150, borderRadius: 10 },
  documentContainer: { flexDirection: 'row', alignItems: 'center' },
  documentIcon: { width: 24, height: 24, marginRight: 10 },
  documentText: { color: '#000' },
  timestamp: { fontSize: 10, color: '#888', marginTop: 5 },
  inputBar: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#F8F8F8' },
  input: { flex: 1, padding: 10, backgroundColor: 'white', borderRadius: 20, fontSize: 16, marginHorizontal: 10 },
  icon: { width: 28, height: 28 },
  replyIndicatorContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#FFF3CD' },
  replyIndicator: { flex: 1, color: '#856404' },
  closeReply: { color: '#856404', fontWeight: 'bold' },
});
