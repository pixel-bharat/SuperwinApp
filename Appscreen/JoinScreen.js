import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Alert, Button } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo for the checkmark icon
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";

export default function JoinRoomScreen() {
  const [roomID, setRoomID] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [userData, setUserData] = useState(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [token, setToken] = useState("");
  const [roomType, setRoomType] = useState("");
  const [recentRooms, setRecentRooms] = useState([]);
  const toggleCheckbox = () => {
    setChecked(!isChecked);
  };

  useEffect(() => {
    console.log(roomID);
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (token) {
          setToken(token);
          const response = await fetch(`${BASE_URL}api/userdata`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUserData(data);
        } else {
          console.log("Token not found");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
      }
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const joinRoom = async (item) => {

    try {
      const token = await AsyncStorage.getItem("userToken");
      const response = await fetch(`${BASE_URL}join-room`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomID: roomID }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Joined Room:", data.room);
        navigation.navigate("RoomUser");

        // Update recent rooms with joined room data
        setRecentRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.roomID === item.roomID
              ? {
                  ...room,
                  members: room.members
                    ? [...room.members, userData.uid]
                    : [userData.uid],
                }
              : room
          )
        );
      } else {
        Alert.alert("Error", data.message || "Failed to join room");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      Alert.alert("Error", "Failed to join room");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Join the Room</Text>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <Text style={styles.inputText}>
            {userData ? userData.uid : "Loading..."}
          </Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Room ID</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Room id"
          value={roomID}
          onChangeText={setRoomID}
        />
      </View>
      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={toggleCheckbox}
      >
        <Ionicons
          name={isChecked ? "checkbox-outline" : "square-outline"}
          size={24}
          color="#fff"
        />
        <Text style={styles.checkboxLabel}>
          I agree to the Terms & Conditions
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={joinRoom}
        disabled={!isChecked}
      >
        <Text style={styles.buttonText}>JOIN ROOM</Text>
      </TouchableOpacity>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
  },
  uidText: {
    color: "#fff",
  },
  textInput: {
    backgroundColor: "#333",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  checkboxLabel: {
    color: "#fff",
    marginLeft: 8,
  },
  button: {
    backgroundColor: "#800080",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
