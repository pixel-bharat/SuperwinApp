import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
} from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";

export default function RoomScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const route = useRoute();
  const [recentRooms, setRecentRooms] = useState([]);
  const [memberRooms, setmemberRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState("");
  const [uid, setUid] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("userToken");
        const storedUid = await AsyncStorage.getItem("userUID");

        if (storedToken && storedUid) {
          console.log("Token and UID found", storedToken, storedUid);
          setToken(storedToken);
          setUid(storedUid);
        } else {
          console.log("Token or UID not found");
        }
      } catch (error) {
        console.error("Error retrieving token or UID:", error);
      }
    };

    if (isFocused) {
      fetchData();
      fetchRecentRooms();
      fetchMemberRooms();
    }
  }, [isFocused]);

  const fetchRecentRooms = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      const storedUid = await AsyncStorage.getItem("userUID");

      if (storedToken) {
        console.log("Fetching recent rooms with token", storedToken); // Debugging line
        const response = await fetch(`${BASE_URL}admin-rooms`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recent rooms");
        }

        const responseData = await response.json();
        console.log("Recent rooms fetched", responseData);
        setRecentRooms(responseData); // Assuming the rooms data is in the 'data' property of the response
        //  setMessage(responseData.message); // Assuming the message is included in the response
      } else {
        console.log("Token not found");
      }
    } catch (error) {
      console.error("Error fetching recent rooms:", error);
      Alert.alert("Error", "Failed to fetch recent rooms");
    }
  };

  const fetchMemberRooms = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");

      if (storedToken) {
        console.log("Fetching recent rooms with token", storedToken);
        const response = await fetch(`${BASE_URL}member-rooms`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recent rooms");
        }

        const responseData = await response.json();
        setmemberRooms(responseData); // Assuming the rooms data is in the 'data' property of the response
        // setMessage(responseData.message); // Assuming the message is included in the response
      } else {
        console.log("Token not found");
      }
    } catch (error) {
      console.error("Error fetching recent rooms:", error);
      Alert.alert("Error", "Failed to fetch recent rooms");
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMemberRooms().then(() => setRefreshing(false));
  }, []);

  const joinRoom = async (item) => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");

      const response = await fetch(`${BASE_URL}join-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
        body: JSON.stringify({ roomID: item.roomID }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Joined Room:", data.existingRoom);
        navigation.navigate("RoomUser");

        // Update recent rooms with joined room data
        setRecentRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.roomID === item.roomID ? data.existingRoom : room
          )
        );

        // Fetch recent rooms again to ensure data is up-to-date
        fetchRecentRooms();
      } else {
        Alert.alert("Error", data.message || "Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      Alert.alert("Error", "Failed to join room");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.roomCard}>
      <View style={styles.roomCardDetailscnt}>
        <Text style={styles.roomName}>{item.roomName}</Text>
        <Text style={styles.roomDetails}>Room ID: {item.roomID}</Text>
        <Text style={styles.roomDetails}>Role: {item.role}</Text>
        <View style={styles.contcnt}>
          <Text style={styles.roomDetailscount}>
            Members {item.membercount}
          </Text>
        </View>

        {/* <Text style={styles.roomDetails}>Members: {item.members.join(", ")}</Text> */}
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => {
          if (item.navigate) {
            navigation.navigate(item.navigate, { roomID: item.roomID }); // Pass roomID as a parameter
          } else {
            console.warn("Navigate property is not set for this item");
          }
        }}
      >
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage
        source={require("../assets/bankbackground.png")}
        style={styles.backgroundImage}
      ></BackgroundImage>
      <FlatList
        style={styles.in_cont}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.headingCnt}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require("../assets/back.png")}
                  style={styles.backButton}
                />
              </TouchableOpacity>
              <Text style={styles.mainHeading}>Room</Text>
            </View>
            <Image
              source={require("../assets/Line.png")}
              style={styles.line}
            ></Image>
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateRoom")}
              style={styles.createRoomButton}
            >
              <LinearGradient
                colors={["#FF9800", "#F44336"]}
                style={styles.gradient}
              >
                <Text style={styles.createRoomButtonText}>+ CREATE A ROOM</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.orText}>or</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("JoinRoom")}
              style={styles.joinRoomButton}
            >
              <LinearGradient
                colors={["#7B1FA2", "#8E24AA"]}
                style={styles.gradient}
              >
                <Text style={styles.joinRoomButtonText}>JOIN BY ROOM ID</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={styles.recentRoomsHeader}>Recent Rooms</Text>
          </View>
        }
        data={[...recentRooms, { isHeader: true }, ...memberRooms]}
        renderItem={({ item }) => {
          if (item.isHeader) {
            return (
              <Text style={styles.recentRoomsHeader}>Your Joined Rooms</Text>
            );
          }
          return renderItem({ item });
        }}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.scrollViewContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  in_cont: {
    marginBottom: "25%",
    marginHorizontal: 16,
  },
  backgroundImage: {
    position: "absolute",
    height: "50%",
    width: "100%",
    resizeMode: "contain",
  },
  headingCnt: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  mainHeading: {
    color: "white",
    fontSize: 22,
    fontWeight: "600",
    paddingHorizontal: "34%",
  },
  line: {
    justifyContent: "center",
    alignSelf: "center",
    marginBottom:10
  },
  backButton: {
    height: 24,
    width: 24,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: "#000",
  //   paddingHorizontal: 16,
  // },
  createRoomButton: {
    marginVertical: 12,
  },
  joinRoomButton: {
    marginVertical: 10,
  },
  gradient: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  createRoomButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  orText: {
    color: "white",
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
  },
  joinRoomButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  recentRoomsHeader: {
    color: "#fff",
    fontWeight: "700",
    marginVertical: 10,
    fontSize: 18,
  },
  recentRoomsList: {
    paddingBottom: 20,
  },
  joinedRoomsList: {
    paddingBottom: 100,
  },
  roomCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  roomCardDetailscnt: {},
  roomName: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 18,
  },
  roomDetails: {
    color: "white",
    marginTop: 5,
    fontSize: 12,
  },
  contcnt: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignContent: "space-around",
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.44)",
    width: "65%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  roomDetailscount: {
    color: "white",
    fontSize: 12,
    fontWeight: "400",
  },
  joinButton: {
    backgroundColor: "#8E24AA",
    borderRadius: 10,
    display: "flex",
    width: 69,
    height: 77,
    // paddingVertical: 26,
    // paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 28,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});