import React from 'react';
import { SafeAreaView, View, ScrollView, Image, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation

export default function OnBoardingScreen() {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Image
          source={require("../assets/onboarding.png")} // Replace with your actual path
          resizeMode="contain"
          style={styles.image}
        />
        <Text style={styles.text}>
          {"“Building Bridges Between Parents and Educators”"}
        </Text>
        <TouchableOpacity
          style={styles.view}
          onPress={() => navigation.navigate('Signin')} // Navigate to Signin screen
        >
          <Text style={styles.text2}>
            {"Get Started"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  image: {
    width: width * 0.9,  // Width set to 90% of the screen width
    height: undefined,
    aspectRatio: 1.2,  // Adjusted aspect ratio for a larger image
    marginBottom: 26,
    alignSelf: "center",  // Centers the image horizontally
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",  // Centers content vertically
    alignItems: "center",
    paddingVertical: 40,
  },
  text: {
    color: "#0F1828",
    fontSize: 24,
    marginBottom: 40,
    textAlign: "center",
  },
  text2: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  view: {
    width: width * 0.8,  // Width set to 80% of the screen width
    alignItems: "center",
    backgroundColor: "#AF8F6F",
    borderRadius: 30,
    paddingVertical: 20,
  },
});
