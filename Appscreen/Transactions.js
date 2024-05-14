import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,ImageBackground,ScrollView, SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

const Transactions = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      console.log("Authentication token not found.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        "http://192.168.1.26:3000/api/transactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(response.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text style={styles.dateText}>
        {new Date(item.transactionDate).toLocaleDateString()}
      </Text>
      <Text style={styles.text}>Type: {item.transactionType}</Text>
      <Text style={styles.text}>Amount: ${item.amount.toFixed(2)}</Text>
      <Text style={styles.text}>Description: {item.description}</Text>
    </View>
  );

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
        
            {loading ? (
              <Text style={styles.loadingText}>Loading...</Text>
            ) : (
              <FlatList
                data={transactions}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderItem}
              />
            )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundStyle: {
    width: "100%",
    height: "80%",
    position: "absolute",
  },
  mainView: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
  },
 
  transactionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#333", // Darker line for subtle separation
    paddingBottom: 10,
    marginBottom: 10,
  },
  scroll__View: {
    padding: 16,
  },
  icon_back: {
    width: 30,
    height: 30,
  },
  text: {
    color: "#fff", // White text color for readability
    fontSize: 16,
  },
  dateText: {
    color: "#aaa", // Light grey for less emphasis
    fontSize: 14,
  },
  Header_container: {
    width: "100%",
    gap: 16,
    
    flexDirection: "row",
  },
  header: {
    fontSize: 22,
    width:"70%",
    textAlign:"center",
    fontWeight: "bold",
    color: "#fff", // Header text color
    marginBottom: 20,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default Transactions;
