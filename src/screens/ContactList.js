import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, SectionList, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  // const navigation = useNavigation();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      const formattedData = formatData(data);
      setContacts(formattedData);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const formatData = (data) => {
    const sections = data.reduce((acc, item) => {
      const firstLetter = item.name[0].toUpperCase();
      if (!acc[firstLetter]) {
        acc[firstLetter] = {
          title: firstLetter,
          data: []
        };
      }
      acc[firstLetter].data.push({
        id: item.id,
        name: item.name,
        phone: '+7 888 574 58 41', // Using the phone number from the image
        thumbnailUrl: `https://ui-avatars.com/api/?name=${item.name}&background=random&color=fff`,
      });
      return acc;
    }, {});

    return Object.values(sections).sort((a, b) => a.title.localeCompare(b.title));
  };

  const handleSelectContact = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;

    return contacts.map(section => {
      const filteredData = section.data.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone.includes(searchQuery)
      );

      return filteredData.length > 0 ? { ...section, data: filteredData } : null;
    }).filter(Boolean);
  }, [contacts, searchQuery]);

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectContact(item.id)} style={styles.contactItem}>
      <Image source={{ uri: item.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        style={[styles.checkbox, selectedIds.has(item.id) && styles.checkboxSelected]}
        onPress={() => handleSelectContact(item.id)}
      >
        {selectedIds.has(item.id) && <Icon name="checkmark" size={16} color="#fff" />}
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Icon name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
        <Text style={styles.title}>Add contacts</Text>
      </View>
      <SectionList
        sections={filteredContacts}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        keyExtractor={(item) => item.id.toString()}
      />
      <TouchableOpacity style={styles.continueButton}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#fff',
    paddingTop: 44, // Adjust this value to move the header down
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 36,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#000',
    padding: 0,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  phone: {
    fontSize: 15,
    color: '#8E8E93',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: '600',
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  continueButton: {
    backgroundColor: '#FF2D55',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ContactList;