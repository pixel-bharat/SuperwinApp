import React, { useState, useEffect } from "react";
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
  Alert,
  ScrollView,
} from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from "@react-native-picker/picker";
import BASE_URL from "../backend/config/config";
import { Share } from "react-native";
import Feather from 'react-native-vector-icons/Feather';
interface UserData {
  uid: string;
}

interface RoomType {
  label: string;
  value: string;
}

const RoomScreen: React.FC = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [roomName, setRoomName] = useState<string>("");
  const [roomID, setRoomID] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [recentRooms, setRecentRooms] = useState<any[]>([]);
  const [roomType, setRoomType] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const roomTypes: RoomType[] = [
    { label: "up to 4 member (INR-10,000)", value: "" },
    { label: "4 Members - 10,000 INR", value: "4_members_10000_inr" },
    { label: "8 Members - 20,000 INR", value: "8_members_20000_inr" },
    { label: "12 Members - 30,000 INR", value: "12_members_30000_inr" },
    { label: "16 Members - 40,000 INR", value: "16_members_40000_inr" },
  ];

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

          const data = await response.json();
          setUserData(data);
        } else {
          Alert.alert("Login Failed", "Token not found");
        }
      } catch (error) {
        console.error("Error retrieving user data:", error);
        Alert.alert("Error", (error as Error).message);
      }
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const generateUniqueRoomID = () => {
    const characters = "0123456789";
    const groups = [];
    const groupSize = 3;
    const delimiter = "-";

    for (let i = 0; i < groupSize * 3; i += groupSize) {
      const group = characters
        .slice(i, i + groupSize)
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
      groups.push(group);
    }

    const formattedRoomID = `RID-${groups.join(delimiter)}`;
    console.log("Generated Room ID:", formattedRoomID);
    setRoomID(formattedRoomID);
  };

  useEffect(() => {
    generateUniqueRoomID();
  }, []);

  const createRoom = async () => {
    if (!termsAccepted) {
      alert("You must agree to the terms and conditions to create a room.");
      return;
    }

    if (!roomType) {
      alert("Please select a room type.");
      return;
    }

    try {
      const roomTypeParts = roomType.split("_");
      const totalMembers = parseInt(roomTypeParts[0]);
      const members = [`${1}/${totalMembers}`];

      let response;
      let data;
      let newRoomID;

      do {
        generateUniqueRoomID();
        newRoomID = roomID;

        response = await fetch(`${BASE_URL}create-room`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            uid: userData ? userData.uid : null,
            roomID: newRoomID,
            roomName: roomName,
            roomType: roomType,
            members: members,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Room ID already exists") {
            console.log("Room ID already exists, retrying...");
          } else {
            throw new Error(errorData.message || "Failed to create room");
          }
        } else {
          data = await response.json();
        }
      } while (!response.ok);

      console.log("Room created successfully:", data);
      navigation.navigate("adminroom", { roomID: data.room.roomID });
    } catch (error) {
      console.error("Error creating room:", error);
      Alert.alert(
        "Error Creating Room",
        (error as Error).message || "Failed to create room"
      );
    }
  };

  const joinRoom = async (item: any) => {
    try {
      const response = await fetch(`${BASE_URL}join-room/${item.roomID}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Joined Room:", data.room);

        setRecentRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.roomID === item.roomID
              ? { ...room, members: [...room.members, userData?.uid] }
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

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.roomCard}>
      <View>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomDetails}>Room ID: {item.roomID}</Text>
        <Text style={styles.roomDetails}>
          Members: {item.members.length}/{item.capacity}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => joinRoom(item)}
      >
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  const shareRoom = () => {
    if (roomID) {
      const deepLink = `superwinApp://room/${roomID}`;
      Share.share({
        message: `Join my room! ${deepLink}`,
      })
        .then((result) => console.log(result))
        .catch((error) => console.error(error));
    } else {
      alert("Please generate a Room ID first.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackgroundImage
        source={require("../assets/bankbackground.png")}
        style={styles.backgroundImage}
      />
      <FlatList
        style={styles.in_cont}
        ListHeaderComponent={
          <View style={styles.scrollViewContent}>
            <View style={styles.headingCnt}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Image
                  source={require("../assets/back.png")}
                  style={styles.backButton}
                />
              </TouchableOpacity>
              <Text style={styles.mainHeading}>Create Room</Text>
            </View>
            <Image source={require("../assets/Line.png")} style={styles.line} />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>
                UID (this is your UID, you cannot change this)
              </Text>
              <View style={styles.inputWrapper}>
                <Image
                  source={require("../assets/PersonFill.png")}
                  style={styles.icon}
                />
                <Text style={styles.inputText}>
                  {userData ? userData.uid : "Loading..."}
                </Text>
              </View>
              <View style={styles.inputWrapper}>
                <Image
                  source={require("../assets/PersonFill.png")}
                  style={styles.icon}
                />
                <TextInput
                  style={[styles.inputText, styles.disabledInput]}
                  placeholder="Room ID"
                  placeholderTextColor="#888"
                  value={roomID}
                  onChangeText={setRoomID}
                  editable={false}
                />
                <TouchableOpacity onPress={generateUniqueRoomID} style={styles.backButton}>
                  <Text style={styles.label}>Generate Room ID</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={shareRoom} style={styles.shareButton}>
                  <Feather name="share" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={styles.label}>Room Name</Text>
              <View style={styles.inputWrapper}>
                <Image
                  source={require("../assets/PersonFill.png")}
                  style={styles.icon}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="Enter Room Name"
                  placeholderTextColor="#888"
                  value={roomName}
                  onChangeText={setRoomName}
                />
              </View>
              <Text style={styles.label}>Room Type</Text>
              <View style={styles.inputWrapperRoomType}>
                <Image
                  source={require("../assets/PersonFill.png")}
                  style={styles.icon}
                />
                <Picker
                  selectedValue={roomType}
                  style={styles.picker}
                  onValueChange={(itemValue) => setRoomType(itemValue)}
                >
                  {roomTypes.map((type) => (
                    <Picker.Item key={type.value} label={type.label} value={type.value} />
                  ))}
                </Picker>
              </View>
              <View style={styles.termsContainer}>
                <Switch
                  value={termsAccepted}
                  onValueChange={setTermsAccepted}
                  trackColor={{ false: "#767577", true: "grey" }}
                  thumbColor={termsAccepted ? "rgba(169, 3, 210, 1)" : "#f4f3f4"}
                />
                <Text style={styles.termsText}>I agree to the Terms & Conditions</Text>
              </View>
            </View>
            <TouchableOpacity onPress={createRoom} style={styles.createRoomButton}>
              <LinearGradient colors={["#FF9800", "#F44336"]} style={styles.gradient}>
                <Text style={styles.createRoomButtonText}>+ CREATE A ROOM</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
        data={recentRooms}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.recentRoomsList}
      />
    </SafeAreaView>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  in_cont: {
    paddingHorizontal: 16,
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
    paddingHorizontal: "30%",
  },
  backButton: {
    height: 24,
    width: 24,
  },
  line: {
    justifyContent: "center",
    alignSelf: "center",
  },
  inputContainer: {
    marginVertical: 20,
  },
  label: {
    color: "rgba(255, 255, 255, 0.42)",
    marginBottom: 8,
    fontSize: 15,
    fontWeight: "400",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  inputWrapperRoomType: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingHorizontal:10,
    marginBottom: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent:'center'
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  inputText: {
    flex: 1,
    color: "#414141",
    fontSize: 14,
  },

  picker: {
    flex: 1,
    color: "rgba(158, 158, 158, 1)",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  termsText: {
    color: "#9E9E9E",
    marginLeft: 10,
    fontSize: 14,
    fontWeight:'400'
  },
  createRoomButton: {
    marginVertical: 10,
  },
  joinRoomButton: {
    marginVertical: 2,
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
    fontWeight: "700",
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
export default RoomScreen;