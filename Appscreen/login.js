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
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faLock, faUser, faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);  // State to manage loading during API call

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true); // Start loading
    try {
      const response = await fetch('http://192.168.1.2:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      Alert.alert("Login Successful", "You have logged in successfully.");
      navigation.navigate("Home"); // Assuming 'Home' is the correct route name
    } catch (error) {
      Alert.alert("Login Failed", error.message || "An unexpected error occurred.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
          </TouchableOpacity>
          <View style={styles.loginForm}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log in to your existing account of SUPERWIN</Text>
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faUser} size={20} color="#fff" />
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
            <View style={styles.inputContainer}>
              <FontAwesomeIcon icon={faLock} size={20} color="#fff" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#fff"
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity onPress={() => Alert.alert("Forgot Password Pressed")}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoading}>
              <LinearGradient
                colors={["#A903D2", "#410095"]}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>LOG IN</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

// Styles remain unchanged


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "contain",
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: 20,
    alignItems: "center",
  },
  logo: {
    width: 150, // Set a fixed width for the logo
    height: 120, // Set a fixed height for the logo
    resizeMode: "contain", // Ensures the image scales correctly within the bounds
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  loginForm: {
    marginTop: 20,
    width:"100%",
    padding:10,
  },
  title: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff1",
    borderRadius: 10,
    paddingLeft: 16,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 60,
    color: "#fff",
    marginLeft: 16,
  },
  forgotPassword: {
    color: "#A903D2",
    textAlign: "right",
    marginBottom: 20,
  },
  loginButton: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  line: {
    height: 1,
    flex: 1,
    backgroundColor: "#3B3B3B",
  },
  orText: {
    marginHorizontal: 10,
    color: "#fff",
  },
  socialButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  socialIcon: {
    width: 70,
    height: 70,
  },
  socialText: {
    color: "#fff",
    fontSize: 16,
  }
});
