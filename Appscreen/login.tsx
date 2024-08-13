// LoginPage.tsx
import React, { useState } from "react";
import {
  ScrollView,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import BASE_URL from "../backend/config/config";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginPage: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleSendOtp = async () => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

    if (!/^(\+?\d{1,3})?\d{10}$/.test(cleanedPhoneNumber)) {
      Alert.alert("Invalid phone number format");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}send-otp`, { phoneNumber: cleanedPhoneNumber });
      Alert.alert("OTP sent to your phone number successfully");
      navigation.navigate("OtpScreen" as never, { phoneNumber: cleanedPhoneNumber } as never);
    } catch (error: any) {
      console.error("Failed to send OTP:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      Alert.alert("Failed to send OTP", "Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          source={require("../assets/dashboardbg.png")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <View style={styles.scrollViewContent}>
            <Text style={styles.title}>Welcome !!</Text>
            <Text style={styles.subtitle}>Please Enter your Phone number</Text>
            <View style={styles.inputContainer}>
              <Image source={require("../assets/phone.png")} style={styles.icon} />
              <TextInput
                placeholder="91 xxxxxxxxxx"
                placeholderTextColor="#aaa4"
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                value={phoneNumber}
                style={styles.input}
              />
            </View>
            <TouchableOpacity
              style={[styles.loginButton, loading ? styles.disabledButton : null]}
              onPress={handleSendOtp}
              disabled={loading}
            >
              <LinearGradient colors={["#A903D2", "#410095"]} style={styles.gradient}>
                {loading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.buttonText}>Send OTP</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "contain",
    width: "100%",
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff2",
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
  loginButton: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
    width: "100%",
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 30,
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default LoginPage;
