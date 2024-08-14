import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../backend/config/config";


export default function BankDetailsScreen() {
  const navigation = useNavigation();
  const [bankDetails, setBankDetails] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [uid, setUid] = useState("");

  // Function to fetch bank details from the server
  const fetchBankDetails = async (uid) => {
    try {

      console.log("Fetching bank details for UID:", uid);
      const response = await fetch(`${BASE_URL}api/bankdetails/user-bank-details/${uid}`);
       console.log(response);
      if (!response.ok) {
        const errorText = await response.text(); // Get the response text to help debug
        console.log("Response status:", response.status);
        console.log("Response text:", errorText);
        throw new Error("Failed to fetch bank details");
      }
  
      const responseData = await response.json();
      console.log("Bank details fetched", responseData);
      setBankDetails(responseData); // Assuming responseData is an array of objects
    } catch (error) {
      console.error("Error fetching bank details:", error.message);
      Alert.alert("Error", "Failed to fetch bank details. Please try again later.");
    } finally {
      setRefreshing(false); // Ensure refreshing state is set appropriately
    }
  };
  

  // useEffect to fetch bank details when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUid = await AsyncStorage.getItem("userUID");

        if (storedUid) {
          console.log("UID found", storedUid);
          setUid(storedUid);
          fetchBankDetails(storedUid);
        } else {
          console.log("UID not found");
          Alert.alert(
            "UID not found",
            "Please check your credentials and try again."
          );
        }
      } catch (error) {
        console.error("Error retrieving UID:", error);
        Alert.alert("Error", "Failed to retrieve UID");
      }
    };

    fetchData();
  }, []);

  // Function to handle pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBankDetails(uid);
    setRefreshing(false);
  };

  // Function to render each item in the FlatList
const renderItem = ({ item }) => {
  if (item.type === "Account") {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          Alert.alert(
            "Account Details",
            `Account Number: ${item.accountNumber}\nIFSC Code: ${item.ifscCode}\nBank Name: ${item.bankName}`
          );
        }}
      >
        <Text style={styles.itemText}>{item.bankName}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
      </TouchableOpacity>
    );
  } else if (item.type === "UPI") {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          Alert.alert(
            "UPI Details",
            `UPI ID: ${item.upiId}`
          );
        }}
      >
        <Text style={styles.itemText}>{item.upiId}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
      </TouchableOpacity>
    );
  } else if (item.type === "Credit Card") {
    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => {
          Alert.alert(
            "Credit Card Details",
            `Card Number: ${item.cardNumber}\nCard Holder: ${item.cardHolderName}\nExpiry Date: ${item.expiryDate}\nCVV: ${item.cvv}`
          );
        }}
      >
        <Text style={styles.itemText}>{item.cardHolderName}</Text>
        <Text style={styles.itemType}>{item.type}</Text>
      </TouchableOpacity>
    );
  } else {
    return null; // Skip rendering for unrecognized types (if any)
  }
};

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/bankbackground.png")}
        style={styles.backgroundImage}
      />
      <View style={styles.innerContainer}>
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/back.png")}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.mainHeading}>Bank Details</Text>
        </View>
        {bankDetails.length > 0 ? (
          <FlatList
            data={bankDetails}
            renderItem={renderItem}
            keyExtractor={(item) => item._id} // Ensure _id is a unique key for each item
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : (
          <Text style={styles.loadingText}>Loading bank details...</Text>
        )}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("addBankDetails")}
        >
          <Text style={styles.buttonText}>ADD BANK DETAILS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  backgroundImage: {
    position: "absolute",
    height: "50%",
    width: "100%",
    resizeMode: "contain",
  },
  headingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  mainHeading: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  backButton: {
    height: 24,
    width: 24,
  },
  itemContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(84, 84, 88, 0.36)",
    padding: 10,
    marginTop: 10,
  },
  itemText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
  },
  itemType: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  addButton: {
    backgroundColor: "#800080",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
});