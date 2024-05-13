import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  ScrollView,SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
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
    textContentType="oneTimeCode"
  />
);

export default function OtpScreen({}) {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const navigation = useNavigation();
  const route = useRoute();
  const { email, uid } = route.params;

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

  const handleSubmit = async () => {
    const otpValue = otp.join("");
    try {
      const response = await fetch("http://192.168.1.26:3000/api/verifyOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp: otpValue, uid }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "OTP is verified", [
          { text: "OK", onPress: () => navigation.navigate("ProfileSetup", { email, uid}) },
        ]);
      } else {
        Alert.alert("Error", data.message || "An unexpected error occurred.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      Alert.alert(
        "Network Error",
        "Failed to verify OTP due to network issues."
      );
    }
  };

  const resendOTP = async () => {
    console.log("Requesting OTP resend for:", email);

    try {
      const response = await fetch("http://192.168.1.26:3000/api/resendOTP", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("OTP resent successfully to:", email);
        Alert.alert("OTP Resent", "A new OTP has been sent to your email.");
      } else {
        console.log(
          "Failed to resend OTP for:",
          email,
          "Response:",
          data.message
        );
        Alert.alert("Error", data.message || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      Alert.alert("Error", "Could not resend OTP due to a network error.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor:"pink" }}>
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
            <View style={styles.info_container}>
              <Text style={styles.title}>Enter OTP</Text>
              <Text style={styles.subtitle}>Please enter the OTP sent to</Text>
              <Text style={styles.subtitle}> {uid}</Text>
              <Text>{email + "  "}</Text>
                
                <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
              source={require("../assets/Edit.png")}
              style={styles.icon}
            ></Image>
                </TouchableOpacity>
              <View style={styles.otpContainer}>
                {otp.map((value, index) => (
                  <View style={styles.input} key={index.toString()}>
                    <OtpInput
                      refInput={inputRefs[index]}
                      value={value}
                      onChangeText={(value) => handleOtpChange(index, value)}
                      maxLength={1}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                  </View>
                ))}
              </View>
              <Text style={styles.resentlink} onPress={resendOTP}>
                Resend again
              </Text>
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
              <LinearGradient
                colors={["#A903D2", "#410095"]}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>Confirm</Text>
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
  logo: {
    width: 150, // Set a fixed width for the logo
    height: 120, // Set a fixed height for the logo
    resizeMode: "contain", // Ensures the image scales correctly within the bounds
  },
  icon: {
    width: 20,
    height: 20,
  },
  info_container: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 20,
  },
  sub_mail: {
    fontSize: 24,
    marginBottom: 40,
    color: "white",
    textAlign: "center",
  },
  otpContainer: {
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
    alignContent: "center",
    justifyContent: "center", // Center the TextInput vertically
    alignItems: "center", // Center the TextInput horizontally
    borderBottomWidth: 1, // Underline style for each input
  },
  otpInput: {
    width: 30,
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF59",
    fontSize: 20,
    color: "white",
    textAlign: "center",
  },

  resentlink: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },

  loginButton: {
    width: "100%",
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
});
