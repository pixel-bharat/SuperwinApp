import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons'; // Make sure you import Ionicons correctly
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";

// Define types for the navigation and route props
type JoinRoomScreenProps = {
  navigation: any;
  route: {
    params: {
      roomID: string;
    };
  };
};

type UserData = {
  uid: string;
};

type Room = {
  roomID: string;
  members: string[];
};

export default function JoinRoomScreen() {
  const [roomID, setRoomID] = useState<string>("");
  const [isChecked, setChecked] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const isFocused = useIsFocused();
  const navigation = useNavigation<any>();
  const [token, setToken] = useState<string>("");
  const [roomType, setRoomType] = useState<string>("");
  const [recentRooms, setRecentRooms] = useState<Room[]>([]);

  const toggleCheckbox = () => {
    setChecked(!isChecked);
  };

  useEffect(() => {
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

          const data: UserData = await response.json();
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

  const joinRoom = async (item: Room) => {
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
        navigation.navigate('RoomUser', { roomID: item.roomID });

        // Update recent rooms with joined room data
        setRecentRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.roomID === item.roomID
              ? {
                  ...room,
                  members: room.members
                    ? [...room.members, userData?.uid ?? ""]
                    : [userData?.uid ?? ""],
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
          placeholder="Enter Room ID"
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
        onPress={() => joinRoom({ roomID, members: [] })}
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
