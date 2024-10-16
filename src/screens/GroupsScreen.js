import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const GroupsScreen = ({ navigation, role }) => {
  const handleCreateGroup = () => {
    navigation.navigate('CreateGroupScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Groups</Text>
      {role === 'faculty' && (
        <Button 
          title="Create New Group"
          onPress={handleCreateGroup}
        />
      )}
      {/* Render list of groups here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default GroupsScreen;
