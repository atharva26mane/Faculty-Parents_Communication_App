import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, View, StyleSheet } from 'react-native';
import ParentStack from './ParentStack'; // Import ParentStack
import GroupChatScreen from './GroupChatScreen';
import AnnouncementsScreen from './AnnouncementsScreen';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function ParentTabs() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Signin'); // Navigate to the Signin screen after logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="FacultyList" component={ParentStack} options={{ title: 'Chats' }} />
        <Tab.Screen name="GroupChat" component={GroupChatScreen} options={{ title: 'Groups' }} />
        <Tab.Screen name="Announcements" component={AnnouncementsScreen} options={{ title: 'Announcements' }} />
        <Tab.Screen
          name="Logout"
          component={() => (
            <View style={styles.logoutContainer}>
              <Button title="Logout" onPress={handleLogout} />
            </View>
          )}
          options={{ title: 'Logout' }}
        />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
