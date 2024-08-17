import React, { useEffect, useState } from 'react';
import { SafeAreaView, Platform } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { firebase } from '@react-native-firebase/firestore';

const PersonalChat = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [users, setUsers] = useState([]);
  const connectionId = route.params.id;

  const firestore = firebase.firestore();
  const currentUserId = firebase.auth().currentUser.uid; // Assuming Firebase Authentication is used

  useEffect(() => {
    const fetchUserRole = async () => {
      const userDoc = await firestore.collection('users').doc(currentUserId).get();
      const userData = userDoc.data();
      setUserRole(userData.role);
    };

    fetchUserRole();
  }, [currentUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      let query = firestore.collection('users');
      if (userRole === 'parent') {
        query = query.where('role', '==', 'faculty');
      }
      const snapshot = await query.get();
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    };

    if (userRole) {
      fetchUsers();
    }
  }, [userRole]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection('chats')
      .doc(connectionId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const messages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            _id: doc.id,
            text: data.text,
            createdAt: data.createdAt.toDate(),
            user: {
              _id: data.is_me ? 'me' : 'other',
              name: data.is_me ? 'You' : 'Friend',
            },
          };
        });
        setMessages(messages);
      });

    return () => unsubscribe();
  }, [firestore, connectionId]);

  const onSend = async (newMessages = []) => {
    const message = newMessages[0];
    await firestore.collection('chats').doc(connectionId).collection('messages').add({
      text: message.text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      is_me: message.user._id === 'me',
    });
  };

  const renderUserList = () => {
    return users.map(user => (
      <Text key={user.id}>{user.name}</Text>
    ));
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {userRole === 'parent' ? (
        <View style={{ padding: 10 }}>
          <Text>Faculty Users:</Text>
          {renderUserList()}
        </View>
      ) : (
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{ _id: 'me' }} // Adjust this based on your user authentication
          renderAvatar={null} // Optional: Customize avatar rendering if needed
          keyboardShouldPersistTaps='handled'
          renderInputToolbar={props => (
            <GiftedChat.InputToolbar {...props} containerStyle={{ borderTopWidth: 1, borderTopColor: '#ddd' }} />
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default PersonalChat;
