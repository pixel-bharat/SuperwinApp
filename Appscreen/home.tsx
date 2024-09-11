import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Image,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  BackHandler,
  FlatList,
  ScrollView,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import BASE_URL from '../backend/config/config';
import LinearGradient from 'react-native-linear-gradient';

interface UserData {
  walletBalance?: number;
}

const data = [
  {id: '1', text: 'Popular', source: require('../assets/firecoin.png')},
  {id: '2', text: 'Lottery', source: require('../assets/dollarcoin.png')},
  {id: '3', text: 'Casino', source: require('../assets/goldCoins.png')},
  {id: '4', text: 'Popular', source: require('../assets/firecoin.png')},
  {id: '5', text: 'Lottery', source: require('../assets/dollarcoin.png')},
  {id: '6', text: 'Casino', source: require('../assets/goldCoins.png')},
];

const gameData = [
  {id: '1', source: require('../assets/aviator.png')},
  {id: '2', source: require('../assets/spinforcash.png')},
  {id: '3', source: require('../assets/scrabble.png')},
  {id: '4', source: require('../assets/cricket.png')},
  {id: '5', source: require('../assets/aviator.png')},
  {id: '6', source: require('../assets/aviator.png')},
  {id: '7', source: require('../assets/aviator.png')},
  {id: '8', source: require('../assets/aviator.png')},
  {id: '9', source: require('../assets/aviator.png')},
  {id: '10', source: require('../assets/aviator.png')},
];

const MemoizedGameItem = React.memo(({item}) => (
  <TouchableOpacity style={styles.itemContainergames}>
    <Image source={item.source} style={styles.image} />
  </TouchableOpacity>
));

const Homepage: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedId, setSelectedId] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetchWalletDetails();
    }
  }, [isFocused]);

  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Do you want to exit the app?', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    if (isFocused) {
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', backAction);
    };
  }, [isFocused]);

  const fetchWalletDetails = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) {
      Alert.alert('Error', 'Authentication token not found. Please log in.');
      return;
    }

    try {
      const response = await axios.get<UserData>(
        `${BASE_URL}api/users/userdata`,
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setUserData(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = error => {
    if (error.response) {
      if (
        error.response.status === 400 &&
        error.response.data.message === 'Invalid token.'
      ) {
        handleInvalidToken();
      } else {
        Alert.alert(
          'Error',
          `Failed to fetch wallet details: ${
            error.response.data.message || error.message
          }`,
        );
      }
    } else if (error.request) {
      Alert.alert('Error', 'No response received from the server.');
    } else {
      Alert.alert('Error', `An error occurred: ${error.message}`);
    }
  };

  const handleInvalidToken = async () => {
    await AsyncStorage.removeItem('userToken');
    Alert.alert('Session Expired', 'Please log in again.', [
      {text: 'OK', onPress: () => navigation.navigate('LoginScreen')},
    ]);
  };

  const handlePress = useCallback(id => {
    setSelectedId(id);
  }, []);

  const renderItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        onPress={() => handlePress(item.id)}
        style={styles.popularbtn}>
        <LinearGradient
          colors={
            selectedId === item.id ? ['#EA4F0D', '#F39A15'] : ['black', 'black']
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={[
            styles.itemContainer,
            selectedId === item.id && styles.pressedContainer,
          ]}>
          <Image source={item.source} style={styles.imageitem} />
          <Text style={styles.textitem}>{item.text}</Text>
        </LinearGradient>
      </TouchableOpacity>
    ),
    [selectedId, handlePress],
  );

  const renderGameItem = useCallback(
    ({item}) => <MemoizedGameItem item={item} />,
    [],
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchWalletDetails().finally(() => setRefreshing(false));
  }, []);

  const renderHeader = useCallback(
    () => (
      <View style={styles.header}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logoheader}
        />
        <View style={styles.totalmoneyctn}>
          <Text style={styles.balncetext}>Total Balance</Text>
          <View style={styles.totalmoneybackground}>
            <TouchableOpacity style={styles.totalmoneybackground}>
              <Image source={require('../assets/coin.png')} />
              <Text style={styles.headingtext}>
                {userData && userData.walletBalance !== undefined
                  ? userData.walletBalance.toFixed(2)
                  : '0.00'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('addMoney')}>
              <Image
                style={{width: 32, height: 32}}
                source={require('../assets/addmoney.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [userData, navigation],
  );

  return (
    <SafeAreaView style={styles.mainView}>
      <ImageBackground
        source={require('../assets/dashboardbg.png')}
        style={styles.backgroundStyle}
      />
      <FlatList
        data={[{key: 'content'}]}
        renderItem={() => null}
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
            <View style={styles.container}>
              <TouchableOpacity style={styles.card}>
                <Image
                  source={require('../assets/banner1.png')}
                  style={styles.banner}
                />
              </TouchableOpacity>
              <Image
                source={require('../assets/Line.png')}
                style={{margin: 16, alignSelf: 'center'}}
              />
              <View style={styles.scrollcntmain}>
                <FlatList
                  data={data}
                  renderItem={renderItem}
                  keyExtractor={item => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContainer}
                />
              </View>
            </View>
          </>
        )}
        ListFooterComponent={() => (
          <>
            <View style={styles.gamesheader}>
              <Text style={styles.promotextgames}>Games</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.accountcard}>
              <FlatList
                data={gameData}
                renderItem={renderGameItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.accountcard}>
              <FlatList
                data={gameData}
                renderItem={renderGameItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.gamesheader}>
              <Text style={styles.promotextgames}>Lottery</Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.text}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.accountcard}>
              <FlatList
                data={gameData}
                renderItem={renderGameItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
            <View style={styles.accountcard}>
              <FlatList
                data={gameData}
                renderItem={renderGameItem}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          </>
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#000',
    paddingVertical: 16,
    marginBottom: '16%',
  },

  backgroundStyle: {
    width: '100%',
    height: '80%',
    position: 'absolute',
  },
  scroll__View: {
    padding: 16,
  },
  logoheader: {
    width: 55,
    height: 50,
  },
  totalmoneyctn: {alignItems: 'flex-end'},
  balncetext: {
    color: 'white',
    fontSize: 14,
    fontWeight: '400',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  headingtext: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  totalmoneybackground: {flexDirection: 'row', alignItems: 'center'},
  container: {
    flex: 1,
  },
  card: {
   padding: 16,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'center',alignItems:'center'
  },
  banner: {
    borderRadius: 10,
  },

  buttonGroup: {
    flexDirection: 'row', // Align buttons in a row
    justifyContent: 'space-between', // Adjust spacing between buttons
    alignItems: 'center',
  },
  popularbtn: {
    borderRadius: 10,
    marginHorizontal: 8, // Add margin between buttons
    overflow: 'hidden',
  },
  itemContainer: {
    display: 'flex',
    width: 113,
    padding: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    borderRadius: 10,
    border: '1px solid rgba(84, 84, 88, 0.36)',
    backdropFilter: 'blur(12px)',
    overflow: 'hidden',
  },
  pressedContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Background color when pressed
    borderColor: 'rgba(255, 255, 255, 0.5)', // Border color when pressed
  },
  imageitem: {
    height: 25,  
    width: 25,
  },
  textitem: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollcntmain: {},
  flatListContainer: {
    left: -20,
    paddingHorizontal: 16, // Adds padding to the horizontal container
    alignItems: 'center', // Center items vertically within the list
  },
  promotextgames: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
  },

  button: {
    display: 'flex',
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F39A15', // Equivalent to var(--ffffff-2-paints, #F39A15)
    backgroundColor: 'transparent', // Default background color
  },
  buttonPressed: {
    backgroundColor: '#F39A15', // Background color when pressed
  },
  text: {
    color: '#A0A0A0', // Text color
    fontSize: 14,
    fontWeight: '600',
  },
  accountcard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemContainergames: {
    width: 110,
    height: 110,
    marginRight: 10,
    borderWidth: 2,
    // borderColor: '#E158E1',
    borderRadius: 8,
    overflow: 'hidden',
  },
  imagegames: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gamesheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 30,
    alignItems: 'center',
  },
  firstcard: {
    width: '47%',
    aspectRatio: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
});

export default Homepage;
