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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";
import { Feather, Ionicons } from "@expo/vector-icons"; // Import Feather and Ionicons icon sets
import BASE_URL from "../backend/config/config";
import { Share } from "react-native";

export default function RoomScreen() {
   const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null);
  const [roomName, setRoomName] = useState("");
  const [roomID, setRoomID] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [recentRooms, setRecentRooms] = useState([]);
  const [roomType, setRoomType] = useState("");
  const [token, setToken] = useState("");
  const roomTypes = [
    { label: "Select your room type", value: "" },
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
          const response = await fetch(
            `${BASE_URL}api/userdata`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

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
        Alert.alert("Error", error.message);
      }
    };

    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const generateUniqueRoomID = () => {
    const characters = "0123456789";
    const groups = [];
    const groupSize = 3; // Number of characters in each group
    const delimiter = "-"; // Delimiter to separate groups

    // Generate random groups of characters
    for (let i = 0; i < groupSize * 3; i += groupSize) {
      const group = characters
        .slice(i, i + groupSize)
        .split("")
        .sort(() => 0.5 - Math.random()) // Shuffle the characters
        .join("");
      groups.push(group);
    }

    const formattedRoomID = `RID-${groups.join(delimiter)}`;
    console.log("Generated Room ID:", formattedRoomID); // Log the room ID to console
    setRoomID(formattedRoomID); // Set the generated room ID in the state
  };

  useEffect(() => {
    generateUniqueRoomID();
  }, []);

 
 // Modify the createRoom function to handle room ID uniqueness
   // Update the createRoom function to handle the format of members
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
    const totalMembers = parseInt(roomTypeParts[0]); // Extract the total number of members
    const members = [`${1}/${totalMembers}`]; // Format the members as "1/totalMembers"

    let response;
    let data;
    let newRoomID;

    do {
      generateUniqueRoomID(); // Generate a new room ID
      newRoomID = roomID;

      // Check if the room ID already exists
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
        // Retry the process if room ID already exists
        if (errorData.message === "Room ID already exists") {
          console.log("Room ID already exists, retrying...");
        } else {
          throw new Error(errorData.message || "Failed to create room");
        }
      } else {
        data = await response.json();
      }
    } while (!response.ok); // Retry until a unique room ID is generated

    console.log("Room created successfully:", data);
    navigation.navigate("adminroom", { roomID: data.room.roomID });
  } catch (error) {
    console.error("Error creating room:", error);
    Alert.alert("Error Creating Room", error.message || "Failed to create room");
  }
};
  // Function to fetch the generated room ID

 
  const joinRoom = async (item) => {
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

        // Update recent rooms with joined room data
        setRecentRooms((prevRooms) =>
          prevRooms.map((room) =>
            room.roomID === item.roomID
              ? { ...room, members: [...room.members, userData.uid] }
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

  // Generate Unique Room ID


  const renderItem = ({ item }) => (
    <View style={styles.roomCard}>
      <View>
        <Text style={styles.roomName}>{item.name}</Text>
        <Text style={styles.roomDetails}>Room ID: {item.roomID}</Text>
        <Text style={styles.roomDetails}>Members: {item.members.length}/{item.capacity}</Text>
      </View>
      <TouchableOpacity style={styles.joinButton} onPress={() => joinRoom(item)}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  // Function to share the room
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
    <ScrollView>
      <SafeAreaView style={styles.container}>
     
   <View contentContainerStyle={styles.scrollViewContent}>
   <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
     <Ionicons name="arrow-back" size={24} color="#fff" />
   </TouchableOpacity>
   <Text style={styles.header}>Room</Text>
   <View style={styles.inputContainer}>
     <Text style={styles.label}>UID (this is your UID, you cannot change this)</Text>
     <View style={styles.inputWrapper}>
       <Image source={require("../assets/PersonFill.png")} style={styles.icon} />
       <Text style={styles.inputText}>{userData ? userData.uid : "Loading..."}</Text>
     </View>
     <View style={styles.inputWrapper}>
       <Image source={require("../assets/PersonFill.png")} style={styles.icon} />
       <TextInput
         style={[styles.input, styles.disabledInput]}
         placeholder="Room ID"
         placeholderTextColor="#888"
         value={roomID}
         onChangeText={setRoomID}
         editable={false}
       />
       <TouchableOpacity onPress={generateUniqueRoomID} style={styles.backButton}>
         <Text style={styles.label}>Room ID</Text>
       </TouchableOpacity>
       <TouchableOpacity onPress={shareRoom} style={styles.shareButton}>
         <Feather name="share" size={24} color="#fff" />
       </TouchableOpacity>
     </View>
     <Text style={styles.label}>Room Name</Text>
     <View style={styles.inputWrapper}>
       <Image source={require("../assets/PersonFill.png")} style={styles.icon} />
       <TextInput
         style={styles.input}
         placeholder="Enter Room Name"
         placeholderTextColor="#888"
         value={roomName}
         onChangeText={setRoomName}
       />
     </View>
     <Text style={styles.label}>Room Type</Text>
     <View style={styles.inputWrapper}>
       <Image source={require("../assets/PersonFill.png")} style={styles.icon} />
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
         trackColor={{ false: "#767577", true: "#81b0ff" }}
         thumbColor={termsAccepted ? "#f5dd4b" : "#f4f3f4"}
       />
       <Text style={styles.termsText}>I agree to the Terms & Conditions</Text>
     </View>
   </View>
   <TouchableOpacity onPress={createRoom} style={styles.createRoomButton}>
     <LinearGradient colors={["#FF9800", "#F44336"]} style={styles.gradient}>
       <Text style={styles.createRoomButtonText}>+ CREATE A ROOM</Text>
     </LinearGradient>
   </TouchableOpacity>
  
   <FlatList
     data={recentRooms}
     renderItem={renderItem}
     keyExtractor={(item) => item.id}
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