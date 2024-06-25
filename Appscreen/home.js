import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Image,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
} from "react-native";

import { useNavigation, useIsFocused } from "@react-navigation/native";
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

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Do you want to exit the app?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
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

             
                <TouchableOpacity
                  onPress={() => navigation.navigate("addMoney")}
                >
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../assets/addmoney.png")}
                  />
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
  headingtext: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  totalmoneybackground: { flexDirection: "row", alignItems: "center" },
  promotextgames: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  accountcard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  firstcard: {
    width: "47%",
    aspectRatio: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: "contain",
  },
});
