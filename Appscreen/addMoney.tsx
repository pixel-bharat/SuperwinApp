import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import BASE_URL from "../backend/config/config";
import { AppStackParamList } from "../App"; // Assuming you have this type defined in App.tsx

type AddMoneyScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'addMoney'>;

const AddMoneyScreen: React.FC = () => {
  const navigation = useNavigation<AddMoneyScreenNavigationProp>();
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  const quickAmounts: number[] = [100, 500, 1000, 2000, 5000];

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async (): Promise<void> => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Error", "You must be logged in to perform this action.");
      return;
    }

    try {
      const response = await axios.get(`${BASE_URL}api/users/userdata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletBalance(response.data.walletBalance);
    } catch (error) {
      console.error("Error fetching wallet balance:", error);
      Alert.alert("Error", "Failed to fetch wallet balance.");
    }
  };
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
    try {
      const response = await axios.post(
        `${BASE_URL}api/transactions/add_money`,
        { amount: numericAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Money added successfully!");
      setAmount("");
      setWalletBalance(response.data.walletBalance);
    } catch (error) {
      console.error(
        "Error adding money:",
        error.response?.data?.message || "An error occurred"
      );
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to add money."
      );
    } finally {
      setLoading(false);
    }
  };

  const fillAmount = (value: number): void => {
    setAmount((prevAmount) => {
      const numericPrevAmount = parseFloat(prevAmount) || 0;
      return (numericPrevAmount + value).toString();
    });
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      />
      <SafeAreaView>
        <View style={styles.safeArea}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Add Money</Text>
          </View>
          <Image
            source={require("../assets/Line.png")}
            style={{ marginTop: 0, alignSelf: "center" }}
          />
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceText}>
              Wallet Balance:{" "}
              {walletBalance !== null ? walletBalance.toFixed(2) : "0.00"}
            </Text>
          </View>
          <View style={styles.inputContainer}>
            <Image source={require("../assets/coin.png")} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="#fff"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              autoCapitalize="none"
            />
          </View>
          <Text style={styles.quickText}>Quick Select</Text>
          <FlatList
            style={styles.quickadd}
            data={quickAmounts}
            keyExtractor={(item) => item.toString()}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.quickFillButton}
                onPress={() => fillAmount(item)}
              >
                <Text style={styles.quickFillText}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.quickFillRow}
          />
          <TouchableOpacity
            style={[
              styles.loginButton,
              isLoading ? styles.disabledButton : null,
            ]}
            onPress={handleAddMoney}
            disabled={isLoading}
          >
            <LinearGradient
              colors={["#A903D2", "#410095"]}
              style={styles.gradient}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Add Money</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
          <View style={styles.linkcont}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.linkText}>Back to Wallet</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};


const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
    justifyContent: "space-between",
  },
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  balanceContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  balanceText: {
    color: "#fff",
    fontSize: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff2",
    borderRadius: 10,
    paddingLeft: 16,
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
  },
  quickadd: {
    height: 100,
  },
  linkcont: {
    width: "100%",
    alignItems: "center",
    padding: 10,
  },
  linkText: {
    color: "#A903D2",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    flex: 1,
    height: 60,
    color: "#fff",
    marginLeft: 16,
  },
  loginButton: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 20,
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  quickFillRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  quickFillButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "#fff6",
    borderRadius: 16,
    marginHorizontal: 5,
    height: 40,
    justifyContent: "center",
  },
  quickText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 10,
  },
  quickFillText: {
    fontSize: 16,
    color: "#fff",
  },
  backgroundStyle: {
    width: "100%",
    height: "80%",
    position: "absolute",
  },
  safeArea: {
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    flex: 1,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});

export default AddMoneyScreen;
