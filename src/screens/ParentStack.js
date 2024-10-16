import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FacultyListScreen from './FacultyListScreen';
import ChatScreen from './ChatScreen';
import FacultyInfoScreen from './FacultyInfoScreen'; // Import FacultyInfoScreen

const Stack = createNativeStackNavigator();

export default function ParentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FacultyList" component={FacultyListScreen} options={{ title: 'Faculty List' }} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ title: 'Chat' }} />
      <Stack.Screen name="FacultyInfo" component={FacultyInfoScreen} options={{ title: 'Faculty Info' }} />
    </Stack.Navigator>
  );
}
