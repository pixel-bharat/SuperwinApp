import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StatusBar,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  Image,ActivityIndicator ,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const WithdrawScreen = () => {
    const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);
  // Quick fill options
  const quickAmounts = [100, 500, 1000, 2000, 5000];


  useEffect(() => {
    // Fetch the updated wallet balance when the component mounts
    fetchWalletBalance();
  }, []); // Only fetch once when the component mounts

  const fetchWalletBalance = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Error', 'You must be logged in to perform this action.');
      return;
    }

    try {
      const response = await axios.get('http://192.168.1.26:3000/api/userdata', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWalletBalance(response.data.walletBalance);
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      Alert.alert('Error', 'Failed to fetch wallet balance.');
    }
  };

  const spendMoney = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Error', 'You must be logged in to perform this action.');
      return;
    }
  
    
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid amount.');
      return;
    }

    if (numericAmount > walletBalance) {
      Alert.alert('Error', 'you do not have balance Available for Withdraw.');
      return;
    }
    setLoading(true);
    axios
      .post('http://192.168.1.26:3000/api/spend', { amount: numericAmount }, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        Alert.alert('Success', 'Money spent successfully!');
        setAmount('');
  
        // Fetch the updated wallet balance after spending money
        await fetchWalletBalance();
      })
      .catch((error) => {
        console.error('Error spending money:', error.response?.data?.message || 'An error occurred');
        Alert.alert('Error', error.response?.data?.message || 'Failed to spend money.');
      })
      .finally(() => {
        setLoading(false);
      });
  };
  

  const fillAmount = (value) => {
    setAmount(value.toString());
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
        <Text style={styles.header}>Add Money</Text>
      </View>
      <Image
        source={require("../assets/Line.png")}
        style={{ marginTop: 0, alignSelf: "center" }}
      />
      <View style={styles.inputContainer}>
        <Image
          source={require("../assets/coin.png")}
          style={styles.icon}
        ></Image>
 
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
        style={[styles.loginButton, loading ? styles.disabledButton : null]}
        onPress={spendMoney}
        disabled={loading}
      >
        <LinearGradient
          colors={["#A903D2", "#410095"]}
          style={styles.gradient}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Withdraw Money</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <View style={styles.linkcont}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.linkText}>Back to Wallet</Text>
        </TouchableOpacity>
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
    justifyContent: "space-between", // Ensures proper distribution of space
  },
  container: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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
    width: '100%',  // Sets the width of the container to 100%
    alignItems: 'center',  // Centers the content horizontally
    padding: 10,  // Optional: Adds some padding around the touchable area
  },
  linkText: {
    color: "#A903D2",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center',
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
  mainView: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
  },
  safeArea: {
    padding: 16,
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
  listContent: {
    paddingBottom: 20,
  },
});

export default WithdrawScreen;
