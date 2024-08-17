import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function LogoutScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Signin'); // Redirect to Signin or any other initial screen
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Are you sure you want to log out?</Text>
      <Button title="Log Out" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
});
