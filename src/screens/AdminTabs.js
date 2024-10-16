// src/components/AdminTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserListScreen from './UserListScreen';
import RemoveUserScreen from './RemoveUserScreen';
import RequestScreen from './RequestScreen';
import LogoutAdmin from './LogoutAdmin';
import TabBarIcon from './TabBarIcon';

const Tab = createBottomTabNavigator();

export default function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Users') {
            iconName = 'account';
          } else if (route.name === 'Remove User') {
            iconName = 'account-remove';
          } else if (route.name === 'Requests For Faculty') {
            iconName = 'bell';
          } else if (route.name === 'Logout') {
            iconName = 'logout';
          }

          return <TabBarIcon name={iconName} color={color} size={size} />;
        },
        tabBarActiveTintColor: '#b38b67',
        tabBarInactiveTintColor: '#c79b6d',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderRadius: 20,
          padding: 5,
          margin: 10,
          height: 60,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        },
        tabBarItemStyle: {
          marginHorizontal: 5,
        },
        tabBarLabelStyle: {
          display: 'none',
        },
      })}
    >
      <Tab.Screen name="Users" component={UserListScreen} />
      <Tab.Screen name="Remove User" component={RemoveUserScreen} />
      <Tab.Screen name="Requests For Faculty" component={RequestScreen} />
      <Tab.Screen name="Logout" component={LogoutAdmin} />
    </Tab.Navigator>
  );
}
