import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import io from '../node_modules/socket.io-client';
import { useState, useEffect } from "react";
import BASE_URL from "../backend/config/config";

const games = [
  { id: '1', name: 'Aviator', image: require('../assets/scrabble.png') },
  { id: '2', name: 'Spin for Cash', image: require('../assets/scrabble.png') },
  { id: '3', name: 'Scrabble', image: require('../assets/scrabble.png') },
  { id: '4', name: 'Warzone', image: require('../assets/scrabble.png') },
];
const RoomUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomID, userID } = route.params; // Access the roomID and userID
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const socket = io(BASE_URL); // Adjust the URL as per your server

  useEffect(() => {
    socket.emit('joinRoom', { roomID, userID });

    socket.on('roomActivated', () => {
      setIsActive(true);
    });

    socket.on('newMessage', (message) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gameItem}>
      <Image source={item.image} style={styles.gameImage} />
      <Text style={styles.gameName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendMessage', { roomID, userID, message: newMessage });
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Room</Text>
      </View>
      <Text style={styles.mainWalletBalance}>Room ID: {roomID}</Text>
      <Text style={styles.mainWalletBalance}>Status: {isActive ? 'Active' : 'Inactive'}</Text>
      <TouchableOpacity style={styles.membersContainer}>
        <Icon name="mic-off" size={20} color="#fff" />
        <Text style={styles.membersText}>Members (3/4)</Text>
      </TouchableOpacity>
      <FlatList
        data={games}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        style={styles.gamesList}
      />
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          renderItem={({ item }) => (
            <View style={styles.message}>
              <Text>{item.sender}: {item.message}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
          style={styles.messageInput}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 10,
  },
  balanceContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  balanceTitle: {
    color: '#fff',
    fontSize: 16,
  },
  balanceAmount: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  mainWalletBalance: {
    color: '#fff',
    fontSize: 14,
  },
  mainWalletAmount: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    marginTop: 5,
  },
  membersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  membersText: {
    color: '#fff',
    marginLeft: 10,
  },
  gamesList: {
    flex: 1,
  },
  gameItem: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
  },
  gameImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  gameName: {
    color: '#fff',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#fff',
  },
});

export default RoomUser;