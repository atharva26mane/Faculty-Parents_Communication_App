import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import OnBoardingScreen from './src/screens/OnBoardingScreen';
import Signin from './src/screens/Signin';
import ParentRegistration from './src/screens/ParentRegistration';
import FacultyRegistration from './src/screens/FacultyRegistration';
import ParentTabs from './src/screens/ParentTabs';
import FacultyTabs from './src/screens/FacultyTabs';
import AdminTabs from './src/screens/AdminTabs';
import WaitingScreen from './src/screens/WaitingScreen';
import ChooseUser from './src/screens/ChooseUser';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // Unsubscribe on unmount
  }, []);

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    setUser(user);
    if (user) {
      try {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        if (userDoc.exists) {
          setRole(userData?.role || null);
        } else {
          const requestDoc = await firestore().collection('facultyRequests').doc(user.uid).get();
          if (requestDoc.exists) {
            setRole('pending'); // Mark as pending if in facultyRequests
          } else {
            setRole(null);
          }
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
    if (initializing) setInitializing(false);
  };

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {role === 'admin' ? (
            <Stack.Screen name="AdminTabs" component={AdminTabs} />
          ) : role === 'faculty' ? (
            <Stack.Screen name="FacultyTabs" component={FacultyTabs} />
          ) : role === 'parent' ? (
            <Stack.Screen name="ParentTabs" component={ParentTabs} />
          ) : role === 'pending' ? (
            <Stack.Screen name="WaitingScreen" component={WaitingScreen} />
          ) : (
            // Provide a fallback screen in case no valid role is found
            <Stack.Screen name="ErrorScreen" component={() => (
              <View style={styles.errorContainer}>
                <Text>Error: No valid role assigned.</Text>
              </View>
            )} />
          )}
        </Stack.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="OnBoardingScreen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="OnBoardingScreen" component={OnBoardingScreen} />
          <Stack.Screen name="Signin" component={Signin} />
          <Stack.Screen name="ChooseUser" component={ChooseUser} />
          <Stack.Screen name="ParentRegistration" component={ParentRegistration} />
          <Stack.Screen name="FacultyRegistration" component={FacultyRegistration} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
