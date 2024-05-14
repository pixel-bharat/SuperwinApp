import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const AddMoneyScreen = () => {
  const navigation = useNavigation();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  // Quick fill options
  const quickAmounts = [100, 500, 1000, 2000, 5000];

  const handleAddMoney = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Error", "You must be logged in to perform this action.");
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid amount.");
      return;
    }

    setLoading(true);
    axios
      .post(
        "http://192.168.1.26:3000/api/add_money",
        { amount: numericAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        Alert.alert("Success", "Money added successfully!");
        setAmount("");
      })
      .catch((error) => {
        console.error(
          "Error adding money:",
          error.response?.data?.message || "An error occurred"
        );
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to add money."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fillAmount = (value) => {
    setAmount(value.toString());
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      ></ImageBackground>
      <SafeAreaView>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <ScrollView style={styles.scroll__View}>
          <View style={styles.Header_container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require("../assets/back.png")}
                style={styles.icon_back}
              ></Image>
            </TouchableOpacity>
            <Text style={styles.header}>Transactions</Text>
          </View>
          <Image
            source={require("../assets/Line.png")}
            style={{ marginTop: 0, alignSelf: "center" }}
          ></Image>

          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <View style={styles.quickFillRow}>
            {quickAmounts.map((value) => (
              <TouchableOpacity
                key={value}
                style={styles.quickFillButton}
                onPress={() => fillAmount(value)}
              >
                <Text style={styles.quickFillText}>INR {value}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Button
            title={loading ? "Adding..." : "Add Money"}
            onPress={handleAddMoney}
            disabled={loading}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  input: {
    width: "100%",
    height: 50,
    marginBottom: 20,
    borderWidth: 1,
    padding: 10,
    fontSize: 16,
    borderColor: "gray",
  },
  quickFillRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  quickFillButton: {
    padding: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
  quickFillText: {
    fontSize: 16,
  },
});

export default AddMoneyScreen;
