import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GroupsScreen from './GroupsScreen';
import CreateGroupScreen from './CreateGroupScreen';

const Stack = createStackNavigator();

function GroupChatNavigator({ role }) {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Groups" 
        component={GroupsScreen} 
        options={{ title: 'Groups' }} 
      />
      {role === 'faculty' && (
        <Stack.Screen 
          name="CreateGroupScreen" 
          component={CreateGroupScreen} 
          options={{ title: 'Create New Group' }} 
        />
      )}
    </Stack.Navigator>
  );
}

export default GroupChatNavigator;
