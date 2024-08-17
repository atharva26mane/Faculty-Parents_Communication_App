import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Import screens
import OnBoardingScreen from './src/screens/OnBoardingScreen';
import Signin from './src/screens/Signin';
import ParentRegistration from './src/screens/ParentRegistration';
import FacultyRegistration from './src/screens/FacultyRegistration';
import ParentTabs from './src/screens/ParentTabs';
import FacultyTabs from './src/screens/FacultyTabs';
import ChooseUser from './src/screens/ChooseUser';
import AdminTabs from './src/screens/AdminTabs'; // Import AdminTabs

const Stack = createNativeStackNavigator();

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // Unsubscribe on unmount
  }, []);

  async function onAuthStateChanged(user: FirebaseAuthTypes.User | null) {
    setUser(user);
    if (user) {
      try {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        setRole(userData?.role || null);
        console.log('User role fetched:', userData?.role); // Debug log
      } catch (error) {
        console.error("Error fetching user role:", error);
        setRole(null);
      }
    } else {
      setRole(null);
    }
    if (initializing) setInitializing(false);
  }

  if (initializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    ); // Show a loading screen while initializing
  }

  return (
    <NavigationContainer>
      {user ? (
        role === 'admin' ? (
          <AdminTabs />
        ) : role === 'faculty' ? (
          <FacultyTabs />
        ) : role === 'parent' ? (
          <ParentTabs />
        ) : (
          <View style={styles.errorContainer}>
            <Text>Error: No valid role assigned.</Text>
          </View>
        )
      ) : (
        <Stack.Navigator initialRouteName="Onboarding">
          <Stack.Screen name="Onboarding" component={OnBoardingScreen} />
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
