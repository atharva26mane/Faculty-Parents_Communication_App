// src/screens/FacultyTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ChatsScreen from './ChatsScreen'; // Make sure this component exists
import GroupsScreen from './GroupsScreen'; // Make sure this component exists
import RequestsScreen from './RequestScreen'; // Make sure this component exists

const Tab = createBottomTabNavigator();

const FacultyTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Groups" component={GroupsScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
    </Tab.Navigator>
  );
};

export default FacultyTabs;
