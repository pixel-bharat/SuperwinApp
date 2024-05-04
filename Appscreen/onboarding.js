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
import { useNavigation } from "@react-navigation/native";

export default function SignUpPage() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://192.168.1.26:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Assuming 'OtpScreen' is set to handle the OTP process and verify it
        navigation.navigate("OtpScreen", { email }); 
      } else {
        Alert.alert("Error", data.message || "Failed to create account.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create account due to network issues.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        resizeMode="cover"
        style={styles.backgroundImage}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={20} color="#fff" />
        </TouchableOpacity>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Join SUPERWIN and start your journey!</Text>
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
          <View style={styles.inputContainer}>
            <FontAwesomeIcon icon={faLock} size={20} color="#fff" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#fff"
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>
          <TouchableOpacity 
            style={styles.signUpButton} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#A903D2", "#410095"]}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>SIGN UP</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    width:"100%"
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  logo: {
    width: 150, // Set a fixed width for the logo
    height: 120, // Set a fixed height for the logo
    resizeMode: "contain", // Ensures the image scales correctly within the bounds
  },
  formContainer: {
    width: "100%",
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
    color:"#fff",
    textAlign: "center",
    marginBottom: 10,
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
  signUpButton: {
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
