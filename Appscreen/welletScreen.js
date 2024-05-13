import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Alert, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletScreen = () => {
  const [amount, setAmount] = useState('');
  const [walletBalance, setWalletBalance] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWalletDetails();
  }, []);

  const fetchWalletDetails = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Error', 'Authentication token not found. Please log in.');
      return;
    }

    try {
      const [walletResponse, transactionsResponse] = await Promise.all([
        axios.get('http://192.168.1.26:3000/api/userdata', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('http://192.168.1.26:3000/api/transactions', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setWalletBalance(walletResponse.data.walletBalance);
      setTransactions(transactionsResponse.data);
    } catch (error) {
      console.error('Failed to fetch wallet details:', error);
      Alert.alert('Error', 'Failed to fetch wallet details');
    }
  };

  const handleAddMoney = async () => {
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

    setLoading(true);
    axios.post('http://192.168.1.26:3000/api/add_money', { amount: numericAmount }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      Alert.alert('Success', 'Money added successfully!');
      setWalletBalance(response.data.walletBalance);  // Update local wallet balance state
      fetchWalletDetails();  // Refresh wallet details including transactions
      setAmount('');
    })
    .catch(error => {
      console.error('Error adding money:', error.response?.data?.message || 'An error occurred');
      Alert.alert('Error', error.response?.data?.message || 'Failed to add money.');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.transactionItem}>
      <Text>Date: {new Date(item.transactionDate).toLocaleDateString()}</Text>
      <Text>Type: {item.transactionType}</Text>
      <Text>Amount: ${item.amount.toFixed(2)}</Text>
      <Text>Description: {item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.balanceText}>
        Current Balance: ${walletBalance !== null ? walletBalance.toFixed(2) : 'Loading...'}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <Button 
        title={loading ? 'Processing...' : 'Add Money'}
        onPress={handleAddMoney}
        disabled={loading}
      />
      <FlatList
        data={transactions}
        keyExtractor={item => item._id.toString()}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.header}>Transactions</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  balanceText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',  // Ensure complete style definition
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  }
});

export default WalletScreen;
