import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const RequestScreen = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const snapshot = await firestore().collection('facultyRequests').where('status', '==', 'pending').get();
        const fetchedRequests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(fetchedRequests);
      } catch (error) {
        console.error('Error fetching faculty requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (id, userId) => {
    try {
      // Update the status of the request in Firestore
      await firestore().collection('facultyRequests').doc(id).update({ status: 'accepted' });

      // Update the role of the user in the 'users' collection to 'faculty'
      await firestore().collection('users').doc(userId).update({ role: 'faculty' });

      console.log(`Accepted request from user ID: ${id} and updated role to faculty`);

      // Remove the accepted request from the state
      setRequests(prev => prev.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      // Remove the request from Firestore
      await firestore().collection('facultyRequests').doc(id).delete();

      console.log(`Removed request from user ID: ${id}`);

      // Remove the deleted request from the state
      setRequests(prev => prev.filter(request => request.id !== id));
    } catch (error) {
      console.error('Error removing request:', error);
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestCard}>
      <Image
        style={styles.profileImage}
        source={{ uri: item.profilePhoto || 'https://via.placeholder.com/100' }} // Use profile photo if available
      />
      <View style={styles.requestContent}>
        <Text style={styles.userName}>{item.name}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAccept(item.id, item.userId)} // Pass userId to update their role
          >
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item.id)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Requests For Faculty</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#AF8F6F" />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>No pending requests at the moment.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 20,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E0E0E0',
  },
  requestContent: {
    flex: 1,
    marginLeft: 20,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: '#B08968',  // Brown color
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: '#F2F2F2',  // Light gray color
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  removeButtonText: {
    color: '#4A4A4A',
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#7D7D7D',
  },
});

export default RequestScreen;
