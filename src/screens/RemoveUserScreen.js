// UserListScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UserListScreen() {
  return (
    <View style={styles.container}>
      <Text>User List Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
