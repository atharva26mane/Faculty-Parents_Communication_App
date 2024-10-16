import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function FacultyInfoScreen({ route }) {
  const { faculty } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{faculty.name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{faculty.email}</Text>
      <Text style={styles.label}>Role:</Text>
      <Text style={styles.value}>{faculty.role}</Text>
      {/* Add more fields if needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
});
