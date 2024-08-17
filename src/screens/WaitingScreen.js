import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

const WaitingScreen = ({ navigation }) => {
  const [isCheckingRole, setIsCheckingRole] = useState(true);

  useEffect(() => {
    const checkFacultyRole = async () => {
      try {
        const userId = auth().currentUser.uid;
        const userDoc = await firestore().collection('users').doc(userId).get();

        if (userDoc.exists && userDoc.data().role === 'faculty') {
          // If user role is faculty, navigate to FacultyTabs
          navigation.navigate('FacultyTabs');
        } else {
          // Continue checking until the user is accepted as faculty
          setIsCheckingRole(false);
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    };

    // Poll every 5 seconds to check if the role has been updated
    const intervalId = setInterval(() => {
      checkFacultyRole();
    }, 5000);

    return () => clearInterval(intervalId); // Cleanup the interval on component unmount
  }, [navigation]);

  // Handle back button press to navigate to Signin screen
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
      {isCheckingRole && <ActivityIndicator size="large" color="#AF8F6F" />}
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
