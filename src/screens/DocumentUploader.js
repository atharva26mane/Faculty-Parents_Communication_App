import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, Modal, Image, StyleSheet, Platform } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import RNFetchBlob from 'rn-fetch-blob';
// import GetRealPath from 'react-native-get-real-path'; // Import the library

export default function DocumentUploader({ onDocumentSent }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      if (result[0]?.uri) {
        const uri = result[0].uri;
        let filePath;

        // Handle content URI for Android
        if (Platform.OS === 'android' && uri.startsWith('content://')) {
          filePath = await getPathForAndroidContentUri(uri);
        } else {
          filePath = uri;
        }

        if (filePath) {
          handleDocumentUpload(filePath, result[0].name);
        } else {
          Alert.alert('Error', 'Failed to retrieve the file path.');
        }
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Document picking was canceled.');
      } else {
        console.error('Error picking document:', err);
        Alert.alert('Error', 'There was an error picking the document.');
      }
    }
  };

  const getPathForAndroidContentUri = async (uri) => {
    try {
      // Use the react-native-get-real-path library to get the actual file path
      const realPath = await GetRealPath.getRealPathFromURI(uri);
      return realPath;
    } catch (error) {
      console.error('Error getting path for content URI:', error);
      return null;
    }
  };

  const handleDocumentUpload = async (filePath, fileName) => {
    if (!filePath) {
      Alert.alert('Error', 'Unable to determine file path.');
      return;
    }

    try {
      const reference = storage().ref(`documents/${fileName}`);
      await reference.putFile(filePath);
      const fileUrl = await reference.getDownloadURL();

      // Call the callback passed from ChatScreen to send the document
      onDocumentSent(fileUrl, fileName);
    } catch (error) {
      console.error('Error uploading document:', error);
      Alert.alert('Upload Error', 'There was an error uploading the document.');
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image source={require('../assets/addextra.png')} style={styles.icon} />
      </TouchableOpacity>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={pickDocument} style={styles.modalOption}>
            <Text style={styles.modalText}>Pick Document</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalOption}>
            <Text style={styles.modalText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOption: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  modalText: {
    fontSize: 16,
  },
});
