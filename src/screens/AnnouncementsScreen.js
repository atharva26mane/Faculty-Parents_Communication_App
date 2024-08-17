import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function AnnouncementsScreen() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const announcementsData = await firestore().collection('announcements').get();
        setAnnouncements(announcementsData.docs.map(doc => doc.data()));
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

  const renderAnnouncement = ({ item }) => (
    <View>
      <Text>{item.title}</Text>
      <Text>{item.message}</Text>
    </View>
  );

  return (
    <View>
      <FlatList
        data={announcements}
        renderItem={renderAnnouncement}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
