import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, BackHandler, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const WaitingScreen = ({ navigation }) => {
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const userId = auth().currentUser.uid;
    const unsubscribe = firestore()
      .collection('facultyRequests')
      .doc(userId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          if (data.status === 'approved') {
            navigation.navigate('FacultyTabs');
          }
        }
      });

    return () => unsubscribe(); // Cleanup on unmount
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.replace('Signin'); // Navigate to Signin screen
        return true; // Return true to prevent default back button behavior
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Please wait, your faculty request is under review.</Text>
      <ActivityIndicator size="large" color="#AF8F6F" />
      <TouchableOpacity onPress={() => navigation.navigate('AdminRequestsScreen')}>
        <Text>Go to Admin Requests</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 18,
    color: '#AF8F6F',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default WaitingScreen;
