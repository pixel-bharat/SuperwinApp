import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../backend/config/config";

const MemberScreen = () => {
  const navigation = useNavigation();
  const roomID = "RID-102-453-687"; // i  Hardcoded roomID for testing purposes
  const [balance, setBalance] = useState(0);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`${BASE_URL}get-balance?roomID=${roomID}`);
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
      } else {
        Alert.alert("Error", data.message || "Failed to fetch balance");
      }
    } catch (error) {
      console.error("Error fetching balance:", error);
      Alert.alert("Error", "Failed to fetch balance");
    }
  };

  const addMoney = async (amount) => {
    try {
      const response = await fetch(`${BASE_URL}add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomID, amount }),
      });

      const responseText = await response.text();
      console.log("Response Text:", responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        throw new Error("Invalid JSON response");
      }

      if (response.ok) {
        setBalance(data.balance);
        Alert.alert("Success", `Added ${amount} to the room balance`);
      } else {
        Alert.alert("Error", data.message || "Failed to add money");
      }
    } catch (error) {
      console.error("Error adding money:", error);
      Alert.alert("Error", "Failed to add money");
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.header}>Room ID: {roomID}</Text>
        <Text style={styles.balance}>Available Balance: {balance}</Text>
        <TouchableOpacity style={styles.button} onPress={() => addMoney(100)}>
          <Text style={styles.buttonText}>Add 100</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  balance: {
    fontSize: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },                        
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MemberScreen;
