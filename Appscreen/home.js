import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Image,
  Alert,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";

import { useNavigation, useIsFocused } from "@react-navigation/native";
import jwtDecode from "jwt-decode"; // Correct import
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../backend/config/config";

export default function Homepage() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isFocused) {
      fetchWalletDetails();
    }
  }, [isFocused]);

  
  const fetchWalletDetails = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Error", "Authentication token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}api/userdata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch wallet details:", error);
      Alert.alert("Error", "Failed to fetch wallet details");
    }
  };

  

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      ></ImageBackground>

      <SafeAreaView>
        <ScrollView style={styles.scroll__View}>
          <View style={styles.header}>
            <Image
              source={require("../assets/logomax.png")}
              style={styles.logoheader}
            ></Image>
            <View style={styles.totalmoneyctn}>
              <Text style={styles.balncetext}>Total Balance</Text>
              <View style={styles.totalmoneybackground}>
                <TouchableOpacity style={styles.totalmoneybackground}>
                  <Image source={require("../assets/coin.png")}></Image>

                  <Text style={styles.headingtext}>
                    {userData && userData.walletBalance !== undefined
                      ? userData.walletBalance.toFixed(2)
                      : "0.00"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image
                  style={{width:32, height:32}}
                    source={require("../assets/addmoney.png")}
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.container}>
          
            <Image
              source={require("../assets/Line.png")}
              style={{ marginTop: 16, alignSelf: "center" }}
            ></Image>
            <View style={styles.scrollcntmain}>
              <Text style={styles.promotextgames}>Games</Text>
              <View style={styles.accountcard}>
                <TouchableOpacity style={styles.firstcard}>
                  <Image
                    style={styles.image}
                    source={require("../assets/spinforcash.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.firstcard}>
                  <Image
                    style={styles.image}
                    source={require("../assets/scrabble.png")}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.accountcard}>
                <TouchableOpacity style={styles.firstcard}>
                  <Image
                    style={styles.image}
                    source={require("../assets/aviator.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.firstcard}>
                  <Image
                    style={styles.image}
                    source={require("../assets/cricket.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  gap40: {
    height: 40,
  },

  mainView: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
  },

  scroll__View: {
    padding: 16,
  },

  backgroundStyle: {
    width: "100%",
    height: "80%",
    position: "absolute",
  },

  logoheader: {
    width: 60,
    height: 50,
  },

  totalmoneyctn: { alignItems: "flex-end" },

  balncetext: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  topcntbackground: {
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  topchildcnt1: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  topchildcnt1img: {
    width: "50%",
    overflow: "hidden",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  slidertop: {
    alignSelf: "center",
    height: 167,
    width: "100%",
    borderWidth: 1,
    borderColor: "grey",
    paddingHorizontal: 10,
  },

  headingtext: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  totalmoneybackground: { flexDirection: "row", alignItems: "center" },

  // new stayling
  promotextgames: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  accountcard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20, // Add marginBottom to create space between rows
  },
  firstcard: {
    width: "47%",
    aspectRatio: 1, // Set the aspect ratio to 1:1
  },
  image: {
    flex: 1,
    aspectRatio: 1, // Set the aspect ratio to 1:1
    resizeMode: "contain", // Adjust resizeMode based on your image requirements
  },
  logoutBtn: {
    marginTop: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  linearGradient: {
    width: "100%",
    height: 64,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
