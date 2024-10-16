import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, FlatList, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';

const CreateGroupScreen = ({ navigation, route }) => {
  const [invitedMembers, setInvitedMembers] = useState([
    { id: 1, name: 'Rashid Khan', role: 'Group Admin', imageUrl: '' },
    { id: 2, name: 'John Doe', role: 'Member', imageUrl: '' },
    { id: 3, name: 'Jane Smith', role: 'Member', imageUrl: '' },
    // Add more members here...
  ]);
  const [groupName, setGroupName] = useState('');
  const [groupPhoto, setGroupPhoto] = useState(null);

  // Fetch profile photos from Firebase Storage
  useEffect(() => {
    const fetchProfilePhotos = async () => {
      const storage = getStorage();
      const updatedMembers = await Promise.all(
        invitedMembers.map(async (member) => {
          const imageRef = ref(storage, `profile_photos/${member.id}.jpg`);
          const imageUrl = await getDownloadURL(imageRef).catch(() => '');
          return { ...member, imageUrl };
        })
      );
      setInvitedMembers(updatedMembers);
    };

    fetchProfilePhotos();
  }, []);

  const handleCreateGroup = () => {
    // Implement group creation logic here
    console.log('Creating group:', { groupName, invitedMembers });
    // Navigate to the newly created group chat or back to the main screen
    navigation.navigate('MainScreen');
  };

  const handleAddPhoto = () => {
    // Implement photo selection logic here
    // For now, we'll just set a placeholder image
    setGroupPhoto('https://via.placeholder.com/150');
  };

  const renderMember = ({ item }) => (
    <View style={styles.memberItem}>
      <Image source={{ uri: item.imageUrl || 'https://via.placeholder.com/50' }} style={styles.memberAvatar} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberRole}>{item.role}</Text>
      </View>
      <TouchableOpacity style={styles.removeMember}>
        <Icon name="close" size={24} color="#8E8E93" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Group</Text>
          </View>

          <TouchableOpacity style={styles.photoContainer} onPress={handleAddPhoto}>
            {groupPhoto ? (
              <Image source={{ uri: groupPhoto }} style={styles.groupPhoto} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Icon name="basketball-outline" size={40} color="#fff" />
                <View style={styles.addPhotoIcon}>
                  <Icon name="add" size={20} color="#fff" />
                </View>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.nameInputContainer}>
            <TextInput
              style={styles.nameInput}
              placeholder="Set name for this group"
              value={groupName}
              onChangeText={setGroupName}
            />
            {groupName !== '' && (
              <TouchableOpacity onPress={() => setGroupName('')}>
                <Icon name="close-circle" size={20} color="#8E8E93" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sectionTitle}>Group Admin</Text>
          <View style={styles.adminContainer}>
            <Image source={{ uri: invitedMembers[0].imageUrl }} style={styles.adminImage} />
            <View style={styles.adminInfo}>
              <Text style={styles.adminName}>{invitedMembers[0].name}</Text>
              <Text style={styles.adminRole}>{invitedMembers[0].role}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Invited Members</Text>
          <FlatList
            data={invitedMembers.slice(1)}
            renderItem={renderMember}
            keyExtractor={(item) => item.id.toString()}
            style={styles.memberList}
          />

          <View style={styles.addMemberContainer}>
            <TouchableOpacity style={styles.addMemberButton}>
              <Text style={styles.plusText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
            <Text style={styles.createButtonText}>Create group</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FF2D55',
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  addPhotoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#4CD964',
    borderRadius: 12,
    padding: 4,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 16,
    height: 50,
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
  },
  nameInput: {
    flex: 1,
    fontSize: 17,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  adminContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  adminImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#D9D9D9',
  },
  adminInfo: {
    marginLeft: 16,
  },
  adminName: {
    fontSize: 16,
    fontWeight: '500',
  },
  adminRole: {
    fontSize: 12,
    color: '#8E8E93',
  },
  memberList: {
    flex: 1,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 17,
    fontWeight: '600',
  },
  memberRole: {
    fontSize: 15,
    color: '#8E8E93',
  },
  removeMember: {
    padding: 4,
  },
  addMemberContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addMemberButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#CFD3D2',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    fontSize: 16,
    color: '#000E08',
  },
  createButton: {
    backgroundColor: '#FF2D55',
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default CreateGroupScreen;
