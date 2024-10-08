import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  FlatList,
  ListRenderItem,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

// Define the structure of a game item
interface Game {
  id: string;
  name: string;
  image: any; // Since we're using require, the type is any
}

// Define the type for route params
type RoomRouteProp = RouteProp<{ Room: { roomID: string } }, 'Room'>;

const games: Game[] = [
  { id: '1', name: 'Aviator', image: require('../assets/scrabble.png') },
  { id: '2', name: 'Spin for Cash', image: require('../assets/scrabble.png') },
  { id: '3', name: 'Scrabble', image: require('../assets/scrabble.png') },
  { id: '4', name: 'Warzone', image: require('../assets/scrabble.png') },
];

const Room: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RoomRouteProp>();
  const { roomID } = route.params; // Access the roomID from the route params

  const renderItem: ListRenderItem<Game> = ({ item }) => (
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
});

export default Room;
