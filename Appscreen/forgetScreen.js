import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from "@react-navigation/native";

const ForgetScreen = () => {
  const navigation = useNavigation();


  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetScreen, setResetScreen] = useState(false);

  
  const handleSendOtp = async (email) => {
    try {
      if (!email) {
        throw new Error("Email is required");
      }
  
      // Call the backend API to send OTP
      const response = await fetch('http://192.168.1.26:3000/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to send OTP. Please try again later.');
      }
  
      const data = await response.json();
      console.log("Response data:", data); // Log the response data for debugging
  
      if (data.message === "OTP sent to your email") {
        console.log("OTP sent successfully.");
        // Proceed to OTP verification screen
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Error sending OTP:", error.message);
      // Display error message to the user
    }
  };
  
  


const handleResetPassword = async (email, otp, newPassword) => {
  try {
    if (!otp || !newPassword) {
      throw new Error("OTP and new password are required");
    }
    
    // Call the backend API to reset password
    const response = await fetch('http://192.168.1.26:3000/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    if (!response.ok) {
      throw new Error('Failed to reset password. Please try again later.');
    }

    const data = await response.json();
    if (data.message === "Password reset successfully") {
      console.log("Password reset successful.");
      // Redirect user to login screen or show a success message
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Error resetting password:", error.message);
    // Display error message to the user
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      {!resetScreen ? (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
          />
          <Button title="Send OTP" onPress={handleSendOtp} />
        </View>
      ) : (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <Button title="Reset Password" onPress={handleResetPassword} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: 300,
  },
});

export default ForgetScreen;
