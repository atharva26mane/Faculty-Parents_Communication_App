import React from "react";
import { SafeAreaView, View, ScrollView, Image, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function ChooseUser({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.column}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/logo.png')}
              resizeMode={"stretch"}
              style={styles.logoImage}
            />
          </View>
          <Text style={styles.headingText}>Choose your option</Text>
          <View style={styles.row}>
            {/* Navigate to Parent Registration */}
            <TouchableOpacity onPress={() => navigation.navigate('ParentRegistration')}>
              <View style={styles.optionContainer}>
                <Image
                  source={require('../assets/Student.png')}
                  resizeMode={"contain"}
                  style={styles.optionImage}
                />
              </View>
            </TouchableOpacity>
            {/* Navigate to Faculty Registration */}
            <TouchableOpacity onPress={() => navigation.navigate('FacultyRegistration')}>
              <View style={styles.optionContainer}>
                <Image
                  source={require('../assets/Tuition.png')}
                  resizeMode={"contain"}
                  style={styles.optionImage}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <Text style={styles.optionText}>Parent</Text>
            <Text style={styles.optionText}>Faculty</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  column: {
    alignItems: 'center',
    backgroundColor: "#FFFFFF",
    paddingBottom: 50,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30, 
  },
  logoImage: {
    height: 150,
    width: 150,
  },
  headingText: {
    color: "#AF8F6F",
    fontSize: 20,
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
    width: '80%',
  },
  optionContainer: {
    backgroundColor: "#AF8F6F",
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  optionImage: {
    height: 80,
    width: 80,
  },
  optionText: {
    color: "#AF8F6F",
    fontSize: 15,
  },
});
