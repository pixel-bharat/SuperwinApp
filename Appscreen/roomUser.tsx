import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const games = [
  { id: '1', name: 'Aviator', image: require('../assets/scrabble.png') },
  { id: '2', name: 'Spin for Cash', image: require('../assets/scrabble.png') },
  { id: '3', name: 'Scrabble', image: require('../assets/scrabble.png') },
  { id: '4', name: 'Warzone', image: require('../assets/scrabble.png') },
];

const RoomUser = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { roomID } = route.params; // Access the roomID

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.gameItem}>
      <Image source={item.image} style={styles.gameImage} />
      <Text style={styles.gameName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
       
        <Text style={styles.headerTitle}>Room</Text>
      </View>
     
      <Text style={styles.mainWalletBalance}>Room ID: {roomID}</Text>
      
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
    justifyContent:'center'
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