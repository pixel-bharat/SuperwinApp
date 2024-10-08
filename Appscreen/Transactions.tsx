//// my code start

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import BASE_URL from "../backend/config/config";
//import Nav from "./nav";

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
        `${BASE_URL}api/transactions/transactions`,
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

  const renderItem = ({ item }) => {
    const transactionTypeStyle =
      item.transactionType === "credit" ? styles.credit : styles.debit;

    return (
      <View style={[styles.itemContainer, transactionTypeStyle]}>
        <View style={styles.tran_cont}>
          <Text style={styles.text}>
            ({item.transactionType}): {item.description}
          </Text>
          <Text style={styles.text}>INR: {item.amount.toFixed(2)}</Text>
        </View>

        <View style={styles.tran_cont}>
          <Text style={styles.dateText}>
            {new Date(item.transactionDate).toLocaleDateString()}
          </Text>
          {/* 
          <Text style={styles.text}>
             money to wallet{" "}
          </Text> */}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      />
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.headerContainer}>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require("../assets/back.png")} style={styles.icon}></Image>
          </TouchableOpacity> */}
          <TouchableOpacity style={{width:40, height:40}} onPress={() => navigation.goBack()}>
          <Image source={require("../assets/back.png")} style={styles.icon}></Image>
          </TouchableOpacity>
          <Text style={styles.header}>Transactions</Text>
        </View>
        <Image
          source={require("../assets/Line.png")}
          style={{ margin: 10, alignSelf: "center" }}
        />
        <View style={{ paddingHorizontal:16 }}>
        {loading ? (
          <Text style={styles.loadingText}>Loading...</Text>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item._id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
        </View>
      
        {/* <Nav/> */}
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
  safeArea: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal:16
  },
  iconBack: {
    width: 30,
    height: 30,
  },
  icon: {
    width: 32,
    height: 32,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
    marginLeft: -30, // Adjust to keep centered
  },
  linkText: {
    color: "#A903D2",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemContainer: {
    justifyContent: "space-between",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    gap: 8,
  },
  tran_cont: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  credit: {
    backgroundColor: "#00FF8930",
  },
  debit: {
    backgroundColor: "#FF00DE40",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  transactionItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    padding: 16,
    marginBottom: 10,

    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
  },
  dateText: {
    color: "#aaa",
    fontSize: 14,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default Transactions;
