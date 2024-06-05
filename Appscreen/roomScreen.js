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
} from "react-native";
import { useNavigation, useIsFocused, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import BASE_URL from "../backend/config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function RoomScreen() {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isChecked, setIsChecked] = useState(false);
  const route = useRoute();
  const [recentRooms, setRecentRooms] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const { refresh } = route.params || {};
    if (refresh) {
      fetchRecentRooms();
    }
  }, [route.params]);

  useEffect(() => {
    // Fetch recent rooms data from the backend
    fetchRecentRooms();
  }, [isFocused]);

  const fetchRecentRooms = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}recent-rooms`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch recent rooms");
      }
      const data = await response.json();
      setRecentRooms(data);
    } catch (error) {
      console.error("Error fetching recent rooms:", error);
    }
  };
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRecentRooms().then(() => setRefreshing(false));
  }, []);
  const renderItem = ({ item }) => (
    <View style={styles.roomCard}>
      <View>
        <Text style={styles.roomName}>{item.roomName}</Text>
        <Text style={styles.roomDetails}>Room ID: {item.roomID}</Text>
        <Text style={styles.roomDetails}>
          Members: {item.members.join(", ")}
        </Text>
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

  const joinRoom = async (item) => {
    if (!termsAccepted) {
      alert("You must agree to the terms and conditions to join a room.");
      return;
    }
  
    try {
      const response = await fetch(
        `${BASE_URL}join-room/${item.roomID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const data = await response.json();
      if (response.ok) {
        console.log("Joined Room:", data.room);
      } else {
        Alert.alert("Error", data.message || "Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      Alert.alert("Error", "Failed to join room");
    }
  };
  

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
  backButton: {
    marginTop: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
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
    color: "#fff",
    fontSize: 16,
  },
  inputText: {
    color: "#fff",
    flex: 1,
  },
  picker: {
    flex: 1,
    color: "#fff",
    backgroundColor: "#333",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  termsText: {
    color: "#fff",
    marginLeft: 10,
    fontSize: 16,
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
  orText: {
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
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
  shareButton: {
    marginLeft: 10,
  },
});