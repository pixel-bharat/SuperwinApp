import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoomScreen() {
  const navigation = useNavigation();
  const [roomID, setRoomID] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomType, setRoomType] = useState('up to 4 member (INR-10,000)');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [recentRooms, setRecentRooms] = useState([
    { id: '1', name: 'Room Name', roomID: 'weu347eu4', members: '10/12' },
    { id: '2', name: 'Room Name', roomID: 'weu347eu4', members: '10/12' },
  ]);

  const createRoom = () => {
    if (!termsAccepted) {
      alert('You must agree to the terms and conditions to create a room.');
      return;
    }
    // Handle room creation logic here
  };

  const joinRoom = () => {
    // Handle join room logic here
  };

  const renderItem = ({ item }) => (
    <View style={styles.roomCard}>
      <View>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomDetails}>Room ID: {item.roomID}</Text>
        <Text style={styles.roomDetails}>Members: {item.members}</Text>
      </View>
      <TouchableOpacity style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.header}>Room</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>UID (this is your UID, you cannot change this)</Text>
        <View style={styles.inputWrapper}>
          <Image source={require('../assets/PersonFill.png')} style={styles.icon} />
          <Text style={styles.inputText}>45938630</Text>
        </View>
        <Text style={styles.label}>Room ID</Text>
        <View style={styles.inputWrapper}>
          <Image source={require('../assets/PersonFill.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Room ID"
            value={roomID}
            onChangeText={setRoomID}
          />
        </View>
        <Text style={styles.label}>Room Name</Text>
        <View style={styles.inputWrapper}>
          <Image source={require('../assets/PersonFill.png')} style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter Room Name"
            value={roomName}
            onChangeText={setRoomName}
          />
        </View>
        <Text style={styles.label}>Room Type</Text>
        <View style={styles.inputWrapper}>
          <Image source={require('../assets/PersonFill.png')} style={styles.icon} />
          <Text style={styles.inputText}>{roomType}</Text>
        </View>
        <View style={styles.termsContainer}>
          <Switch value={termsAccepted} onValueChange={setTermsAccepted} />
          <Text style={styles.termsText}>I agree to the Terms & Conditions</Text>
        </View>
      </View>
      <TouchableOpacity onPress={createRoom} style={styles.createRoomButton}>
        <LinearGradient
          colors={['#FF9800', '#F44336']}
          style={styles.gradient}
        >
          <Text style={styles.createRoomButtonText}>+ CREATE A ROOM</Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text style={styles.orText}>or</Text>
      <TouchableOpacity onPress={joinRoom} style={styles.joinRoomButton}>
        <LinearGradient
          colors={['#7B1FA2', '#8E24AA']}
          style={styles.gradient}
        >
          <Text style={styles.joinRoomButtonText}>JOIN BY ROOM ID</Text>
        </LinearGradient>
      </TouchableOpacity>
      <Text style={styles.recentRoomsHeader}>Recent Rooms</Text>
      <FlatList
        data={recentRooms}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.recentRoomsList}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 16,
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    color: '#fff',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
  },
  inputText: {
    color: '#fff',
    flex: 1,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  termsText: {
    color: '#fff',
    marginLeft: 10,
  },
  createRoomButton: {
    marginVertical: 10,
  },
  joinRoomButton: {
    marginVertical: 10,
  },
  gradient: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  createRoomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  joinRoomButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 10,
  },
  recentRoomsHeader: {
    color: '#fff',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  recentRoomsList: {
    paddingBottom: 100,
  },
  roomCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
  },
  roomName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  roomDetails: {
    color: '#ccc',
  },
  joinButton: {
    backgroundColor: '#8E24AA',
    borderRadius: 10,
    padding: 10,
  },
  joinButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
