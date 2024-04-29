import React, { useState } from "react";
import {
  ScrollView,
  View,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock, faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Alert } from "react-native";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.fullscreen}>
      <ImageBackground
        source={require("../assets/Maskbackround.png")}
        resizeMode="cover"
        style={styles.backgroundStyle}
      />
      
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="light-content" />
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
        </TouchableOpacity>

        <View style={styles.cont}>
          <View style={styles.header}>
            <Text style={styles.heading}>Welcome back!</Text>
            <Text style={styles.textlog}>
              Log in to your existing account of SUPERWIN
            </Text>
          </View>

          <View style={styles.textInputView}>
            <FontAwesomeIcon icon={faUser} style={styles.textboxicon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#fff"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.textInputView}>
            <FontAwesomeIcon icon={faLock} style={styles.textboxicon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#fff"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />
          </View>
          <Text
            style={styles.forgot}
            onPress={() => console.log("Forgot Password Pressed")}
          >
            Forgot Password?
          </Text>
          <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                Alert.alert(
                  "Login Success",
                  "You will now be navigated to Home screen.",
                  [
                    {
                      text: "OK",
                      onPress: () => navigation.navigate("nav"), // Ensure 'Home' is a valid route name
                    },
                  ]
                );
              }}
            >
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#A903D2", "#410095"]}
            style={styles.linearGradient}
            angle={"45"}
            useAngle={true}
          >
            
              <Text style={styles.buttonText}>LOG IN</Text>
           
          </LinearGradient>
          </TouchableOpacity>
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.line} />
          </View>
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => console.log("Login with Google Pressed")}
            >
              <Image source={require("../assets/Google.png")} />
              <Text style={styles.socialText}> Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => console.log("Login with Facebook Pressed")}
            >
              <Image source={require("../assets/Facebook.png")} />
              <Text style={styles.socialText}> Facebook</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: "#000", // Adjust this to match the background if needed
  },
  container: {
    flexGrow: 1,
    justifyContent: "flex-end", // Ensures the content is aligned at the bottom
    alignItems: 'center',
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 30,
    zIndex: 10,
  },
  backgroundStyle: {
    width: "100%",
    height: "100%", // Set height to 100% of the container
    position: "absolute",
    bottom: 0,
  },
  logo: {
    width: "40%",
    height: 100,
    resizeMode: "contain",
  },
  cont: {
    width: "100%",
    alignItems: "center",
    padding: 20,
    paddingBottom: 20, // Adds padding at the bottom
  },
  textInputView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF1A",
    borderRadius: 10,
    paddingHorizontal: 20,
    width: "100%",
    marginBottom: 12,
  },
  textboxicon: {
    color: "#fff",
    marginRight: 10,
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
  input: {
    flex: 1,
    height: 56,
    color: "#fff",
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  forgot: {
    color: "#A903D2",
    fontSize: 14,
    marginBottom: 20,
  },
  linearGradient: {
    width: "100%",
    height:"100%",
    borderRadius: 10,
    justifyContent: "center", // Center the button text vertically
    alignItems: "center", // Center the button text horizontally
  },
  buttonContainer: {
    marginTop: 20,
    borderRadius: 16,
    width: "100%",
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#FFFFFF6B",
  },
  orText: {
    width: 30,
    textAlign: "center",
    color: "#fff",
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  socialButton: {
    flexDirection: "column",
    alignItems: "center",
  },
  socialText: {
    color: "#fff",
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
});
