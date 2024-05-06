import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
const OtpInput = ({ value, onChangeText, maxLength }) => (
  <TextInput
    style={styles.otpInput}
    maxLength={maxLength}
    keyboardType="numeric"
    value={value}
    onChangeText={onChangeText}
  />
);

const OtpScreen = ({ myauth, callback, subject, email }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    try {
      const response = await fetch("http://192.168.1.26:3000/api/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP is verified", [
          { text: "OK", onPress: () => navigation.navigate("profilesetup") },
        ]); // Added closing parenthesis here
      } else {
        Alert.alert("Error", data.message); // Added 'Error' title for consistency
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Failed to verify OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>{subject}</Text>
      <View style={styles.otpContainer}>
        <OtpInput
          value={otp[0]}
          onChangeText={(value) => handleOtpChange(0, value)}
          maxLength={1}
        />
        <OtpInput
          value={otp[1]}
          onChangeText={(value) => handleOtpChange(1, value)}
          maxLength={1}
        />
        <OtpInput
          value={otp[2]}
          onChangeText={(value) => handleOtpChange(2, value)}
          maxLength={1}
        />
        <OtpInput
          value={otp[3]}
          onChangeText={(value) => handleOtpChange(3, value)}
          maxLength={1}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <LinearGradient colors={["#A903D2", "#410095"]} style={styles.gradient}>
          <Text style={styles.buttonText}>Confirm</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 40,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 20,
    marginHorizontal: 10,
  },
  button: {
    width: "80%",
    height: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OtpScreen;
