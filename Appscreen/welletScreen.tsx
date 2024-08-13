import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Alert,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";
import AddMoneyScreen from "./addMoney";
// Define the structure of user data
interface UserData {
  name: string | null;
  avatar: string | null;
  walletBalance: number | null;
  uniqueId: string | null;
  email: string | null;
}

// Define the structure of a transaction object
interface Transaction {
  id: string;
  amount: number;
  type: string;
  date: string;
}

const WalletScreen: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState<UserData>({
    name: null,
    avatar: null,
    walletBalance: null,
    uniqueId: null,
    email: null,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

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

    console.log("Token:", token);

    try {
      setLoading(true); // Show loading indicator
      const [walletResponse, transactionsResponse] = await Promise.all([
        axios.get(`${BASE_URL}api/userdata`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}api/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      console.log("Wallet response data:", walletResponse.data);

      setUserData({
        name: walletResponse.data.name,
        avatar: walletResponse.data.avatar,
        walletBalance: walletResponse.data.walletBalance,
        uniqueId: walletResponse.data.userId,
        email: walletResponse.data.email,
      });
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error("Failed to fetch wallet details:", error);
      Alert.alert("Error", "Failed to fetch wallet details");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      />

      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.hellotext}>Hello, {userData.name}</Text>

            <View style={styles.balancebackground}>
              <Text style={styles.balancetext}>Available Balance</Text>
              <Text style={styles.ruppestext}>
                INR{" "}
                {userData.walletBalance !== null
                  ? userData.walletBalance.toFixed(2)
                  : "0.00"}
              </Text>
            </View>

            <Text style={styles.balancetext}>Note:</Text>
            <View style={styles.withdrawbackground}>
              <Text style={styles.withdrawtext}>Available for Withdraw</Text>
              <Text style={styles.withdrawmoney}>
                INR{" "}
                {userData.walletBalance !== null
                  ? (userData.walletBalance * 0.8).toFixed(2) // Calculate 80% of the wallet balance
                  : "0.00"}
              </Text>
            </View>
          </View>

          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#000000", "#00000000"]}
            style={styles.linearGradient}
            angle={45}
            useAngle={true}
          >
            <View style={styles.transationbackground}>
              <View style={styles.totalwinsbackground}>
                <ImageBackground
                  source={require("../assets/Carddown.png")}
                  style={styles.cardBackground}
                  resizeMode="cover"
                >
                  <View style={styles.totalwinsbackgroundcard}>
                    <Image source={require("../assets/arrowdown.png")} />
                    <Text style={styles.Textw}>Total Wins</Text>
                    <Text style={styles.money}>INR 540.99</Text>
                  </View>
                </ImageBackground>
              </View>

              <View style={styles.totaldrawbackground}>
                <ImageBackground
                  source={require("../assets/Cardup.png")}
                  style={styles.cardBackground}
                  resizeMode="cover"
                >
                  <View style={styles.totalwinsbackgroundcard}>
                    <Image source={require("../assets/up-arrow.png")} />
                    <Text style={styles.Textw}>Total Withdraw</Text>
                    <Text style={styles.money}>INR 540.99</Text>
                  </View>
                </ImageBackground>
              </View>
            </View>

            <Text style={styles.promotext}>Quick Actions</Text>
            <View style={styles.quickCnt}>
              <TouchableOpacity
                style={styles.quickCntblock}
                onPress={() => navigation.navigate("addMoney")}
                disabled={loading}
              >
                <Image source={require("../assets/moneybag.png")} />
                <Text style={styles.quicktext}>
                  {loading ? "Processing..." : "Add Money"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("spendMoney")}
              >
                <View style={styles.quickCntblock}>
                  <Image source={require("../assets/money.png")} />
                  <Text style={styles.quicktext}>Withdraw</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate("Transactions")}
              >
                <View style={styles.quickCntblock}>
                  <Image source={require("../assets/history.png")} />
                  <Text style={styles.quicktext}>History</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.promobackground}>
              <Text style={styles.promotext}>Promo & Discount</Text>
              <TouchableOpacity>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={["#A903D2", "#410095"]}
                  style={styles.linearGradientseemore}
                  angle={45}
                  useAngle={true}
                >
                  <Text style={styles.promobtntext}>SEE MORE</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.promocardcnt}>
              <TouchableOpacity style={styles.promocard}>
                <View>
                  <Text style={styles.promohead}>
                    Special Offer for{"\n"} Today's Top Up
                  </Text>
                  <Text style={styles.promopara}>
                    Get discount for every top up,{"\n"}transfer and payment
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.promocard}>
                <View>
                  <Text style={styles.promohead}>
                    Special Offer for{"\n"} Today's Top Up
                  </Text>
                  <Text style={styles.promopara}>
                    Get discount for every top up,{"\n"}transfer and payment
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
  },
  container: {
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 0,
    height: 300,
    width: "100%",
  },
  backgroundStyle: {
    width: "100%",
    height: "80%",
    position: "absolute",
  },
  hellotext: {
    fontSize: 26,
    color: "white",
    fontWeight: "600",
  },
  balancebackground: {
    justifyContent: "center",
    alignItems: "center",
  },
  balancetext: {
    color: "white",
  },
  ruppestext: {
    fontSize: 34,
    fontWeight: "800",
    color: "white",
  },
  withdrawbackground: {
    alignItems: "center",
  },
  withdrawtext: {
    color: "grey",
    fontWeight: "600",
    fontSize: 14,
  },
  withdrawmoney: {
    fontSize: 24,
    fontWeight: "600",
    color: "grey",
  },
  linearGradient: {
    borderColor: "rgba(84, 84, 88, 0.36)",
    borderTopWidth: 1,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  transationbackground: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  totalwinsbackground: {
    width: "48%",
  },
  totaldrawbackground: {
    width: "48%",
  },
  Textw: {
    color: "grey",
    marginTop: 15,
  },
  money: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 5,
  },
  quicktext: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "SF Pro",
  },
  quickCnt: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 16,
    borderColor: "#FFFFFF1F",
    borderWidth: 2,
  },
  quickCntblock: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  promotext: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  promobackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  linearGradientseemore: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  promobtntext: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  promocardcnt: {
    justifyContent: "center",
    alignItems: "center",
  },
  promocard: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 40,
    borderRadius: 10,
    marginVertical: 16,
    borderColor: "#FFFFFF1F",
    borderWidth: 2,
  },
  promohead: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },
  promopara: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 20,
    textAlign: "center",
  },
  totalwinsbackgroundcard: {
    padding: 16,
  },
  cardBackground: {
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    borderRadius: 16,
    overflow: "hidden",
  },
});

export default WalletScreen;
