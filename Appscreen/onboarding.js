import React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  ImageBackground,
  Image,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock, faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Onboarding({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <ImageBackground
          source={require("../assets/Maskbackround.png")}
          style={styles.imageBackground}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
          </TouchableOpacity>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </ImageBackground>

        <View style={styles.outText}>
          <View style={styles.header}>
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.textlog}>
              Create a account of SUPERWIN.
            </Text>
          </View>

          {renderTextInput("Email", faUser)}
          {renderTextInput("Enter Password", faLock)}
          {renderTextInput("Confirm Password", faLock)}

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#A903D2", "#410095"]}
            style={styles.linearGradient}
          >
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.navigate("Home")}
            >
              <Text style={styles.buttonText}>NEXT</Text>
            </TouchableOpacity>
          </LinearGradient>
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signInText}>Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  function renderTextInput(placeholder, icon) {
    return (
      <View style={styles.textInputView}>
        <FontAwesomeIcon icon={icon} style={styles.textboxicon} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#fff"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  imageBackground: {
    flex: 1, // Make ImageBackground flexible to fit the screen
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 30,
    zIndex: 10,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  outText: {
    padding: 30,
    marginTop: "auto", // Pushes the content to the bottom
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  textlog: {
    color: "#EBEBF5",
    fontSize: 16,
  },
  heading: {
    color: "#EBEBF5",
    fontSize: 32,
    fontWeight: "bold",
  },
  textInputView: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
    backgroundColor: "#FFFFFF1A",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  textboxicon: {
    marginRight: 15,
    color: "#fff",
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 20,
    borderRadius: 16,
    color: "#fff",
  },

  nextText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  footer: {
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 20,
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
  linearGradient: {
    marginTop: 20,
    width: "100%",
    height: 64,
    borderRadius: 10,
    justifyContent: "flex-end", // Center the button text vertically
    alignItems: "center", // Center the button text horizontally
  },
  buttonContainer: {
    borderRadius: 16,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
