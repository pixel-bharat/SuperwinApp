import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
  ScrollView, RefreshControl 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import BASE_URL from "../backend/config/config";

export default function BankDetailsScreen() {
  const navigation = useNavigation();
  const [bankDetails, setBankDetails] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [uid, setUid] = useState("");

  // Function to fetch bank details from the server
  const fetchBankDetails = async (uid) => {
    try {
      const response = await fetch(`${BASE_URL}api/bankdetails/user-bank-details/${uid}`);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch bank details: ${errorText}`);
      }
  
      const data = await response.json();
      console.log("Fetched data:", data);
  
      // Combine all details into one object
      const combinedData = {
        accountNumber: "",
        bankName: "",
        ifscCode: "",
        upiId: "",
        cardHolderName: "",
        cardNumber: "",
        expiryDate: "",
        cvv: ""
      };
  
      data.forEach(item => {
        if (item.accountNumber) {
          combinedData.accountNumber = item.accountNumber;
          combinedData.bankName = item.bankName;
          combinedData.ifscCode = item.ifscCode;
        }
        if (item.upiId) {
          combinedData.upiId = item.upiId;
        }
        if (item.cardNumber) {
          combinedData.cardHolderName = item.cardHolderName;
          combinedData.cardNumber = item.cardNumber;
          combinedData.expiryDate = item.expiryDate;
          combinedData.cvv = item.cvv;
        }
      });
  
      console.log("Combined data:", combinedData);
      setBankDetails(combinedData); // This will override the existing bank details with the new data
  
    } catch (error) {
      console.error("Error fetching bank details:", error.message);
      Alert.alert("Error", "Failed to fetch bank details. Please try again later.");
    } finally {
      setRefreshing(false);
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

  // Function to render each section
  const renderSection = (title, data) => {
    if (!data) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.detailsContainer}>
          {data.upiId && <Text style={styles.detailText}>UPI ID: {data.upiId}</Text>}
          {data.accountNumber && (
            <>
              <Text style={styles.detailText}>Account Number: {data.accountNumber}</Text>
              <Text style={styles.detailText}>Bank Name: {data.bankName}</Text>
              <Text style={styles.detailText}>IFSC Code: {data.ifscCode}</Text>
            </>
          )}
          {data.cardNumber && (
            <>
              <Text style={styles.detailText}>Card Number: {data.cardNumber}</Text>
              <Text style={styles.detailText}>Card Holder: {data.cardHolderName}</Text>
              <Text style={styles.detailText}>Expiry Date: {data.expiryDate}</Text>
              <Text style={styles.detailText}>CVV: {data.cvv}</Text>
            </>
          )}
        </View>
      </View>
    );
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
  
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {bankDetails ? (
            <View>
              <Text style={styles.sectionTitle}>Added Details</Text>
              <View style={styles.detailsContainer}>
                <Text>UPI ID: {bankDetails.upiId || "N/A"}</Text>
                <Text>Account Number: {bankDetails.accountNumber || "N/A"}</Text>
                <Text>Bank Name: {bankDetails.bankName || "N/A"}</Text>
                <Text>IFSC Code: {bankDetails.ifscCode || "N/A"}</Text>
                <Text>Card Holder Name: {bankDetails.cardHolderName || "N/A"}</Text>
                <Text>Card Number: {bankDetails.cardNumber || "N/A"}</Text>
                <Text>Expiry Date: {bankDetails.expiryDate || "N/A"}</Text>
                <Text>CVV: {bankDetails.cvv || "N/A"}</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.loadingText}>Loading bank details...</Text>
          )}
        </ScrollView>
  
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(84, 84, 88, 0.36)",
    padding: 10,
  },
  detailText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
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
