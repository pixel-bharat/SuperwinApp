import React from "react";
import {
  ScrollView,
  View,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function WalletScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      ></ImageBackground>
      <ScrollView style={styles.bgcolor1}>
        <View style={styles.container}>
          <Text style={styles.hellotext}>Hello, Member</Text>
          <View style={styles.balancebackground}>
            <Text style={styles.balancetext}>Available Balance</Text>
            <Text style={styles.ruppestext}>50,684.89*</Text>
          </View>
          <Text style={styles.balancetext}>Note:</Text>
          <View style={styles.withdrawbackground}>
            <Text style={styles.withdrawtext}>Available for Withdraw</Text>
            <Text style={styles.withdrawmoney}>40,405.05</Text>
          </View>
        </View>
        <LinearGradient
          backdroxp
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={["#000000", "#6666665c"]}
          style={styles.linearGradient}
          angle={"45"}
          useAngle={true}
        >
          <View style={styles.transationbackground}>
            <View style={styles.totalwinsbackground}>
              <ImageBackground
                source={require("../assets/Carddown.png")}
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
                resizeMode="cover"
              ></ImageBackground>
              <View style={styles.totalwinsbackgroundcard}>
                <Image source={require("../assets/arrowdown.png")}></Image>
                <Text style={styles.Textw}>Total Wins</Text>
                <Text style={styles.money}>INR 130,540.99</Text>
              </View>
            </View>
            <View style={styles.totaldrawbackground}>
              <ImageBackground
                source={require("../assets/Cardup.png")}
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "absolute",
                  borderRadius: 16,
                  overflow: "hidden",
                }}
                resizeMode="cover"
              ></ImageBackground>
              <View style={styles.totalwinsbackgroundcard}>
                <Image source={require("../assets/up-arrow.png")}></Image>
                <Text style={styles.Textw}>Total Withdraw</Text>
                <Text style={styles.money}>$72,540.99</Text>
              </View>
            </View>
          </View>
          <Text style={styles.promotext}>Quick Actions</Text>
          <View style={styles.quickCnt}>
            <TouchableOpacity>
              <View style={styles.quickCntblock}>
                <Image source={require("../assets/moneybag.png")}></Image>
                <Text style={styles.quicktext}>Deposit</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.quickCntblock}>
                <Image source={require("../assets/money.png")}></Image>
                <Text style={styles.quicktext}>Withdraw</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.quickCntblock}>
                <Image source={require("../assets/history.png")}></Image>
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
                angle={"45"}
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
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000",
  },
  bgcolor1: { paddingTop: 20 },
  container: {
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 0,
    height: 279,
    width: "100%",
  },
  backgroundStyle: {
    width: "100%",
    height: "80%",
    position: "absolute",
  },
  hellotext: { fontSize: 26, color: "white", fontWeight: "600" },
  balancebackground: { justifyContent: "center", alignItems: "center" },

  balancetext: {
    color: "white",
  },
  ruppestext: { fontSize: 34, fontWeight: "800", color: "white" },
  withdrawbackground: { alignItems: "center" },
  withdrawtext: { color: "grey", fontWeight: "600", fontSize: 14 },
  withdrawmoney: { fontSize: 24, fontWeight: "600", color: "grey" },
  linearGradient: {
    borderColor: "rgba(84, 84, 88, 0.36)",
    borderWidth: 1,
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
  Textw: { color: "grey", marginTop: 15 },
  money: { color: "white", fontSize: 18, fontWeight: "600", marginTop: 5 },
  quicktext: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    fontfamily: "SF Pro",
    fontsize: 14,
    fontweight: 400,
  },
  quickCnt: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
    backgroundColor: "black",
    borderRadius: 10,
    paddingVertical: 16,
  },
  quickCntblock: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  quicktext: { color: "white" },
  promotext: { color: "white", fontSize: 18, fontWeight: "700" },
  promobackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  linearGradientseemore: {
    borderRadius: 10,
    justifyContent: "center", // Center the button text vertically
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  promocardcnt: { justifyContent: "center", alignItems: "center" },
  promobtntext: { color: "white", fontSize: 16, fontWeight: "700" },
  promocard: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 40,
    borderRadius: 10,
    marginVertical: 16,
  },
  promohead: { color: "white", fontSize: 24, fontWeight: "700" },
  promopara: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginVertical: 20,
    textAlign: "center",
  },
  totalwinsbackgroundcard: {
    padding: 16,
    // borderRadius: 26,
  },
});
