import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from './ChatsScreen';
import RequestScreen from './RequestScreen';
import AnnouncementsScreen from './AnnouncementsScreen';
import FLogoutScreen from './FLogoutScreen';
import GroupChatNavigator from './GroupChatNavigator';

const Tab = createBottomTabNavigator();

const FacultyTabs = ({ userRole }) => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Groups">
        {(props) => <GroupChatNavigator {...props} role={userRole} />}
      </Tab.Screen>
      <Tab.Screen name="Requests For Faculty" component={RequestScreen} />
      <Tab.Screen name="Announcements" component={AnnouncementsScreen} />
      <Tab.Screen name="Logout" component={FLogoutScreen} />
    </Tab.Navigator>
  );
};

export default FacultyTabs;
