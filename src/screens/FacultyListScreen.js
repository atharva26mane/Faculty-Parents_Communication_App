import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

export default function FacultyListScreen({ navigation }) {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      setError(null);
      try {
        const facultyData = await firestore().collection('users').where('role', '==', 'faculty').get();
        const fetchedData = facultyData.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFacultyList(fetchedData);
      } catch (error) {
        setError("Error fetching faculty data");
        console.error("Error fetching faculty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  const navigateToChat = (faculty) => {
    navigation.navigate('ChatScreen', { faculty });
  };

  const renderFaculty = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigateToChat(item)}>
      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && <Text style={styles.text}>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={facultyList}
        renderItem={renderFaculty}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.text}>No faculty members found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  text: {
    color: 'black',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
});
