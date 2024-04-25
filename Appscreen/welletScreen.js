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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

const Stack = createNativeStackNavigator();

export default function WalletScreen({ navigation }) {
  // Destructure navigation directly from props
  return (
    <SafeAreaView style={styles.mainView}>
      <ImageBackground
        source={require("../assets/Maskbackround.png")}
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
        <View>
          
        </View>
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
  bgcolor1: { padding: 16 },
  container: {
    
justifyContent:'space-evenly',
    alignItems: "center",
    padding: 0,
    height: 279,
    width: "100%",
  },
  backgroundStyle: {
    width: "100%",
    height: 400,
    justifyContent: "flex-end",
    alignItems: "center",
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
withdrawmoney:{fontSize:24,fontWeight:'600',color:'grey'}
});
