import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";
import { color } from 'react-native-elements/dist/helpers';

const AddMoneyScreen = () => {
    const navigation = useNavigation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(null);

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
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>Back</Text>
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ height: 40, width: 200, borderColor: 'gray', borderWidth: 1, marginBottom: 20, color:"white" }}
        placeholder="Enter amount to spend"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity
        style={{ backgroundColor: 'blue', padding: 10, borderRadius: 5 }}
        onPress={spendMoney}
      >
        <Text style={{ color: 'white' }}>Spend Money</Text>
      </TouchableOpacity>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    color: '#fff', // White text color
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20, // Add spacing between the back button and other UI components
  },
});

export default AddMoneyScreen;
