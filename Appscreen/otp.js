import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; // Added useRoute to get params
import { LinearGradient } from "expo-linear-gradient";

const OtpInput = ({ value, onChangeText, maxLength, onKeyPress, refInput }) => (
  <TextInput
    ref={refInput}
    style={styles.otpInput}
    maxLength={maxLength}
    keyboardType="numeric"
    value={value}
    onChangeText={onChangeText}
    onKeyPress={onKeyPress}
    textContentType="oneTimeCode" // iOS only: for automatic SMS OTP handling
  />
);

const OtpScreen = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const navigation = useNavigation();
  const route = useRoute(); // Get params passed to this screen
  const { email } = route.params; // Destructure email from route.params

  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (value.length === 1 && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key: keyValue } }, index) => {
    if (keyValue === 'Backspace' && otp[index] === '') {
      if (index > 0) {
        inputRefs[index - 1].current.focus();
      }
    }
  };

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    try {
      const response = await fetch("http://192.168.1.2:3000/api/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP is verified", [
          { text: "OK", onPress: () => navigation.navigate("UserProfileScreen") } // Navigate to HomeScreen after successful verification
        ]);
      } else {
        Alert.alert("Error", data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert("Network Error", "Failed to verify OTP due to network issues.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>{'Please enter the OTP sent to ' + email}</Text>
      <View style={styles.otpContainer}>
        {otp.map((value, index) => (
          <OtpInput
            key={index}
            refInput={inputRefs[index]}
            value={value}
            onChangeText={(value) => handleOtpChange(index, value)}
            maxLength={1}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
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
