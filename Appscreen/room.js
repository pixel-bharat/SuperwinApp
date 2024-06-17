import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import  { useState, useEffect } from "react";
import BASE_URL from "../backend/config/config";

const games = [
  { id: '1', name: 'Aviator', image: require('../assets/scrabble.png') },
  { id: '2', name: 'Spin for Cash', image: require('../assets/scrabble.png') },
  { id: '3', name: 'Scrabble', image: require('../assets/scrabble.png') },
  { id: '4', name: 'Warzone', image: require('../assets/scrabble.png') },
];

const Room = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomID, userID } = route.params; // Access the roomID and userID
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const socket = io(BASE_URL, {
    transports: ['websocket'],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }); // Adjust the URL as per your server
  useEffect(() => {
    console.log(`Connecting to socket at ${BASE_URL}`);

    socket.on('connect', () => {
      console.log('Connected to socket');
      socket.emit('joinRoom', { roomID, userID }, (response) => {
        console.log('joinRoom response:', response);
      });
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from socket');
    });

    socket.on('roomActivated', () => {
      console.log('Room activated');
      setIsActive(true);
    });

    socket.on('newMessage', (message) => {
      console.log('New message received:', message);
      setMessages(prevMessages => [...prevMessages, message]);
    });

    return () => {
      console.log('Disconnecting socket');
      socket.disconnect();
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gameItem}>
      <Image source={item.image} style={styles.gameImage} />
      <Text style={styles.gameName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const activateRoom = () => {
    console.log('Activating room with ID:', roomID);
    socket.emit('activateRoom', { roomID }, (response) => {
      console.log('activateRoom response:', response);
    });
  };

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
      <View style={styles.balanceContainer}>
        <Text style={styles.mainWalletBalance}>Room ID: {roomID}</Text>
        <Text style={styles.balanceTitle}>Available Room Balance</Text>
        <Text style={styles.balanceAmount}>50,684.89</Text>
        <Text style={styles.mainWalletBalance}>Main Wallet Balance</Text>
        <Text style={styles.mainWalletAmount}>140,405.05</Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="add-circle" size={30} color="#fff" />
          <Text style={styles.actionText}>Add Fund</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="cash" size={30} color="#fff" />
          <Text style={styles.actionText}>Withdraw</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="time" size={30} color="#fff" />
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>
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
      <TouchableOpacity onPress={activateRoom} style={styles.activateButton}>
        <Text style={styles.activateButtonText}>Activate Room</Text>
      </TouchableOpacity>
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
  activateButton: {
    padding: 15,
    backgroundColor: '#28a745',
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  activateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  message: {
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    marginVertical: 5,
  },
  messageInput: {
    padding: 10,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    color: '#fff',
    marginVertical: 10,
  },
  sendButton: {
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Room;