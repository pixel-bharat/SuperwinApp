import React from "react";
import {
  ScrollView,
  View,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Start({ navigation }) {
  return (
    <View style={styles.fullscreen}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
        resizeMode="cover"
      >
        <ScrollView style={styles.bgcolor1} contentContainerStyle={styles.container}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>
              Generate anything what’s in your mind now
            </Text>
            <Text style={styles.descriptionText}>
              An AI that developed to help you generate what’s in your mind into
              beautiful visual
            </Text>
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              colors={["#A903D2", "#410095"]}
              style={styles.linearGradient}
            >
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>LETS GO!</Text>
              </TouchableOpacity>
            </LinearGradient>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Onboard")}
              >
                <Text style={styles.signInText}>Sign Up Here</Text>
              </TouchableOpacity>
            </View>
          </View>
          <StatusBar style="auto" />
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: "#000", // Adjust this to match the background if needed
  },
  bgcolor1: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-end', // Push content to the bottom
    alignItems: 'center', // Center content horizontally
  },
  backgroundStyle: {
    width: "100%",
    height: "100%", // Set height to 100% of the container
    position: "absolute",
    bottom: 0,
  },
  logo: {
    width: 250,
    height: 200,
    resizeMode: "contain",
  },
  textWrapper: {
    alignItems: "center",
    padding: 30,
  },
  headerText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#EBEBF5",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
  linearGradient: {
    marginTop: 20,
    width: 346,
    height: 64,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    paddingVertical: 20,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensure footer takes full width of its container
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  signInText: {
    color: "#A903D2",
    fontSize: 16,
    fontWeight: "bold",
  },
});
