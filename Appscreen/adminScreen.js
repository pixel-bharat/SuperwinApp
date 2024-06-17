import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet ,TouchableOpacity} from "react-native";

import BASE_URL from "../backend/config/config";
import { useRoute, useNavigation } from "@react-navigation/native";

const AdminScreen = () => {
    const navigation=useNavigation()
  const route = useRoute();
  const roomID = "RID-102-453-687"; // Hardcoded roomID for testing purposes
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Fetch initial balance from the server
    const fetchBalance = async () => {
      try {
        const response = await fetch(`${BASE_URL}get-balance?roomID=${roomID}`);
        const data = await response.json();
        if (response.ok) {
          setBalance(data.balance);
        } else {
          console.error("Error fetching balance:", data.message);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };

    fetchBalance();
  }, [roomID]);

  return (
    <View style={styles.container}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"<"}</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Admin Room ID: {roomID}</Text>
      <Text style={styles.balance}>Available Balance: {balance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
  balance: {
    fontSize: 20,
    marginBottom: 20,
  },
});

export default AdminScreen;
