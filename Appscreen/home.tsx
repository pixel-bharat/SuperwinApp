import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Image,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Linking
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import BASE_URL from "../backend/config/config";



interface UserData {
  walletBalance?: number;
  name?: string;
  uid?: string;
}

interface GameData {
  uuid: string;
  name: string;
  image: string;
  type: string;
  provider: string;
  technology: string;
  has_lobby: boolean;
  is_mobile: boolean;
  has_freespins: boolean;
  has_tables: boolean;
  freespin_valid_until_full_day: boolean;
}

const Homepage: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [games, setGames] = useState<GameData[]>([]);
  const [gameUrl, setGameUrl] = useState();
  useEffect(() => {
    if (isFocused) {
      fetchWalletDetails();
      fetchGames();
    }
  }, [isFocused]);

  const fetchWalletDetails = async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Error", "Authentication token not found. Please log in.");
      return;
    }

    try {
      const response = await axios.get<UserData>(`${BASE_URL}api/users/userdata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);

      const playerName = response.data.name;
      const playerId = response.data.uid;
      if (playerName && playerId) {
        await AsyncStorage.setItem("playerName", playerName);
        await AsyncStorage.setItem("playerId", playerId);
      } else {
        Alert.alert("Error", "Player name or ID not found.");
      }
    } catch (error) {
      handleErrorResponse(error);
    }
  };

  const fetchGames = async () => {
    try {
      const response = await axios.get<GameData[]>(`${BASE_URL}games/games`, {
        headers: {
          "x-merchant-id": "12345678", 
        },
      });
      setGames(response.data.data.items);
      // console.log(response)
    } catch (err) {
      Alert.alert("Error", "Failed to fetch games");
    }
  };

  const initializeGame = async (gameid: String) => {
    const token = await AsyncStorage.getItem("userToken");
    const playerId = await AsyncStorage.getItem("playerId");
    const playerName = await AsyncStorage.getItem("playerName");
    const returnUrl = 'superwinapp://return'; 
    if (!token || !playerId || !playerName) {
      Alert.alert("Error", "Required user details not found. Please log in again.");
      return;
    }
    console.log("game id triggered", gameid)
    // const gameUuid = game.uid;
    // console.log(gameUuid)

    const session_id = new Date().getTime().toString();
    try {
      const response = await axios.post(
        `${BASE_URL}api/games/init`,
        {
          game_uuid: gameid, 
          player_id: playerId,
          player_name: playerName,
          currency: "USD",
          session_id: session_id,
          return_url:  returnUrl,
          language: "en",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Full response object:", response.data);

      if (response.data || response.data.url || response.data.data.url) {
       
        const gameUrl = response.data.data.url;
        console.log(gameUrl);                         
        Linking.openURL(gameUrl);


        

      } else {
        Alert.alert("Error", "Failed to initialize the game. URL not found in response.");
      }
    } catch (error) {
      console.error("Error initializing game:", error);
      Alert.alert("Error", `Failed to initialize the game: ${error.message}`);
    }
  }
  const handleErrorResponse = (error: any) => {
    if (error.response) {
      if (error.response.status === 400 && error.response.data.message === "Invalid token.") {
        AsyncStorage.removeItem("userToken");
        Alert.alert("Session Expired", "Please log in again.", [
          { text: "OK", onPress: () => navigation.navigate("LoginScreen") }
        ]);
      } else {
        Alert.alert("Error", `Failed to fetch wallet details: ${error.response.data.message || error.message}`);
      }
    } else if (error.request) {
      Alert.alert("Error", "No response received from the server.");
    } else {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    }
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      />

      <SafeAreaView>
        <ScrollView style={styles.scroll__View}>
          <View style={styles.header}>
            <Image
              source={require("../assets/logo.png")}
              style={styles.logoheader}
            />
            <View style={styles.totalmoneyctn}>
              <Text style={styles.balncetext}>Total Balance</Text>
              <View style={styles.totalmoneybackground}>
                <TouchableOpacity style={styles.totalmoneybackground}>
                  <Image source={require("../assets/coin.png")} />
                  <Text style={styles.headingtext}>
                    {userData && userData.walletBalance !== undefined
                      ? userData.walletBalance.toFixed(2)
                      : "0.00"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('addMoney')}>
                  <Image
                    style={{ width: 32, height: 32 }}
                    source={require("../assets/addmoney.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <Image
              source={require("../assets/Line.png")}
              style={{ marginTop: 16, alignSelf: "center" }}
            />
            <View style={styles.scrollcntmain}>
              <Text style={styles.promotextgames}>Games</Text>
              <View style={styles.accountcard}>
                {games.map((game) => (
                  <TouchableOpacity
                    key={game.uuid}
                    style={styles.firstcard}
                    onPress={() => initializeGame(game.uuid)}
                  >
                    <Image style={styles.image} source={{ uri: game.image }} />
                    <Text style={styles.gameTitle}>{game.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>




        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
  },
  scroll__View: {
    padding: 16,
  },
  backgroundStyle: {
    width: "100%",
    height: "80%",
    position: "absolute",
  },
  logoheader: {
    width: 55,
    height: 50,
  },
  totalmoneyctn: { alignItems: "flex-end" },
  balncetext: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  headingtext: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  totalmoneybackground: { flexDirection: "row", alignItems: "center" },
  promotextgames: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#fff",
  },
  accountcard: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  firstcard: {
    width: "47%",
    aspectRatio: 1,
    marginBottom: 20,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    resizeMode: "contain",
  },
  gameTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
  },
});

export default Homepage;
