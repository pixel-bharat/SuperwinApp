// VerifyOtpPage.js
import React, { useState, useRef } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";

export default function OtpScreen() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key: keyValue } }, index) => {
    if (keyValue === "Backspace" && otp[index] === "") {
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const submitOTP = async () => {
    const enteredOtp = otp.join("");

    try {
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}verify-otp`,
        {
          phoneNumber,
          otp: enteredOtp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data && response.data.token) {
        const { uid, profileSetupRequired, token } = response.data;
        await AsyncStorage.setItem("userToken", token); // Store token
        Alert.alert("Phone number verified successfully!");

        setTimeout(() => {
          if (profileSetupRequired) {
            navigation.navigate("ProfileSetup", { phoneNumber, uid });
          } else {
            navigation.navigate("nav"); // Navigate to HomePage or any other screen
          }
        }, 0);
      } else {
        Alert.alert("Verification failed", "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error.response || error.message);

      let errorMessage = "An unknown error occurred";
      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          errorMessage;
      }

      Alert.alert("Verification failed", errorMessage);
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={require("../assets/back.png")}
              style={styles.icon}
            ></Image>
          </TouchableOpacity>
          <View style={styles.scrollViewContent}>
            <Text style={styles.title}>Phone number : </Text>
            <Text style={styles.title}>
              {phoneNumber}{" "}
              <Image
                onPress={() => navigation.goBack()}
                source={require("../assets/Edit.png")}
                style={styles.icon}
              ></Image>
            </Text>
            <Text style={styles.title}>Enter OTP</Text>
           

            <View style={styles.otp_input}>
              {otp.map((value, index) => (
                <View key={index} style={styles.otpContainer}>
                  <TextInput
                    ref={inputRefs[index]}
                    style={styles.otpInput}
                    placeholder="*"
                    maxLength={1}
                    value={value}
                    onChangeText={(value) => handleOtpChange(index, value)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    textContentType="oneTimeCode"
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.loginButton,
                loading ? styles.disabledButton : null,
              ]}
              onPress={submitOTP}
              disabled={loading}
            >
              <LinearGradient
                colors={["#A903D2", "#410095"]}
                style={styles.gradient}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Verify OTP</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

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
  otp_input: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    margin: 40,
    alignItems: "flex-end", // Align items to the bottom
  },
  input: {
    flex: 1,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#FFFFFF1A",
    marginHorizontal: 10,
    justifyContent: "center",
  },
  otpContainer: {
    margin: 10,
    marginVertical: 20,
    width: 60,
    backgroundColor: "#fff2",
    borderRadius: 8,
  },
  otpInput: {
    borderBottomWidth: 2,
    borderColor: "#aaa",
    fontSize: 30,
    textAlign: "center",
    padding: 10,
    margin: 10,
    color: "#fff",
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
});
