import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ParentStack from './ParentStack';
import GroupChatScreen from './GroupChatScreen';
import AnnouncementsScreen from './AnnouncementsScreen';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { Button, View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function ParentTabs() {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('Signin'); // Ensure 'Signin' is correctly registered in the root navigator
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Tab.Navigator>
      <Tab.Screen name="FacultyListStack" component={ParentStack} options={{ title: 'Chats' }} />
      <Tab.Screen name="GroupChat" component={GroupChatScreen} options={{ title: 'Groups' }} />
      <Tab.Screen name="Announcements" component={AnnouncementsScreen} options={{ title: 'Announcements' }} />
      <Tab.Screen
        name="Logout"
        options={{ title: 'Logout' }}
        component={() => (
          <View style={styles.logoutContainer}>
            <Button title="Logout" onPress={handleLogout} />
          </View>
        )}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logoutContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
