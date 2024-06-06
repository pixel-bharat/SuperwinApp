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
} from "react-native";
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
    }
  }, [isFocused]);

  const fetchRecentRooms = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("userToken");
      const storedUid = await AsyncStorage.getItem("userUID");

      if (storedToken) {
        console.log("Fetching recent rooms with token", storedToken); // Debugging line
        const response = await fetch(`${BASE_URL}recent-rooms`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recent rooms");
        }

        const data = await response.json();
        setRecentRooms(data);
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
    fetchRecentRooms().then(() => setRefreshing(false));
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
      <View>
        <Text style={styles.roomName}>{item.roomName}</Text>
        <Text style={styles.roomDetails}>Room ID: {item.roomID}</Text>
        <Text style={styles.roomDetails}>Members: {item.members[0]}</Text>
        {/* Show only the members count */}
        <Text style={styles.roomDetails}>Roles: {item.roles.join(", ")}</Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => joinRoom(item)}
      >
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView style={styles.container}>
        <View contentContainerStyle={styles.scrollViewContent}>
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
          <FlatList
            data={recentRooms}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.recentRoomsList}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
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
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  createRoomButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  joinRoomButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  recentRoomsHeader: {
    color: "#fff",
    fontWeight: "bold",
    marginVertical: 10,
    fontSize: 18,
  },
  recentRoomsList: {
    paddingBottom: 100,
  },
  roomCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  roomName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  roomDetails: {
    color: "#ccc",
  },
  joinButton: {
    backgroundColor: "#8E24AA",
    borderRadius: 10,
    padding: 10,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
