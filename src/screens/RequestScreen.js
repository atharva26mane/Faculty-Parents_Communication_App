import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const RequestScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore().collection('facultyRequests')
      .onSnapshot(snapshot => {
        const newRequests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(newRequests);
        setLoading(false);
      }, error => {
        console.error("Error fetching requests: ", error);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (request) => {
    try {
      // Add the user to the "users" collection
      await firestore().collection('users').doc(request.id).set({
        name: request.name,
        email: request.email,
        profilePhoto: request.profilePhoto,
        role: 'faculty', // Set the role as 'faculty'
      });

      // Remove the user from the "facultyRequests" collection
      await firestore().collection('facultyRequests').doc(request.id).delete();

      console.log("Accepted:", request.name);

      // Update the local state to remove the accepted request
      setRequests(requests.filter(req => req.id !== request.id));
    } catch (error) {
      console.error("Error accepting request: ", error);
    }
  };

  const handleRemove = async (request) => {
    try {
      // Remove the user from the "facultyRequests" collection
      await firestore().collection('facultyRequests').doc(request.id).delete();

      console.log("Removed:", request.name);

      // Update the local state to remove the removed request
      setRequests(requests.filter(req => req.id !== request.id));
    } catch (error) {
      console.error("Error removing request: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: item.profilePhoto }} 
          style={styles.profileImage} 
          defaultSource={require('../assets/default_profile.png')} // Fallback image
        />
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(item)}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemove(item)}
        >
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  requestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 15,
    justifyContent: 'space-between',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e3e3e3',
    marginRight: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: '#B0875B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginHorizontal: 8,
  },
  removeButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 25,
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default RequestScreen;
