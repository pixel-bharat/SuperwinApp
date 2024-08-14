import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  ImageBackground,
  StyleSheet,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";

export default function ProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [userData, setUserData] = useState({
    phoneNumber: "",
    uid: "",
    avatar: null,
    memberName: "",
  });

  const navigation = useNavigation();
  const route = useRoute();
  useEffect(() => {
    fetchUserData();
    console.log("userdata is ", userData);
  }, []);

  
  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      console.log("token is ", token);
      const response = await fetch(`${BASE_URL}api/users/userdata`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data) {
        setUserData(data);
      } else {
        console.log("Received null or undefined data from API");
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to fetch user data.");
      setUserData(null);
    }
  };  
    useEffect(() => {
      if (route.params?.phoneNumber && route.params?.uid) {
        setUserData((prev) => ({
          ...prev,
          phoneNumber: route.params.phoneNumber,
          uid: route.params.uid,
        }));
      } else {
        loadUserData();
      }
    }, [route.params]);

    const loadUserData = async () => {
      try {
        const phoneNumber = await AsyncStorage.getItem("phoneNumber");
        const uid = await AsyncStorage.getItem("userId");
        const name = await AsyncStorage.getItem("name");
        const email = await AsyncStorage.getItem("email");
      
        if (phoneNumber && uid) {
          setUserData((prev) => ({
            ...prev,
            phoneNumber: phoneNumber,
            uid: uid,
            name: name || '',
            email: email || '',
          }));
        } else {
          console.log("No user data in AsyncStorage.");
        }
      } catch (error) {
        console.error("Error loading user data from AsyncStorage:", error);
        Alert.alert("Error", "Failed to load user data.");
      }
    };

  const saveProfile = async () => {
    setNameError("");
    setAvatarError("");

    if (!userData.name) {
      setNameError("Name is required.");
    }

    if (!userData.avatar) {
      setAvatarError("Avatar selection is required.");
    }

    if (!userData.name || !userData.avatar) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/users/avatar`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      await AsyncStorage.setItem("userToken", response.data.token);

      Alert.alert("Profile saved successfully!");
      navigation.navigate("nav");
    } catch (error) {
      console.error("Save profile error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        Alert.alert("Error", `Error saving profile: ${error.response.data.message}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        Alert.alert("Error", "No response from server. Please try again later.");
      } else {
        console.error("Error message:", error.message);
        Alert.alert("Error", `Error saving profile: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const avatars = {
    avatar1: require("../assets/avatar/avatar_1.png"),
    avatar2: require("../assets/avatar/avatar_2.png"),
    avatar3: require("../assets/avatar/avatar_3.png"),
    avatar4: require("../assets/avatar/avatar_4.png"),
    avatar5: require("../assets/avatar/avatar_5.png"),
    uploadAvatar: require("../assets/avatar/upload_avatar.png"),
  };

  const selectAvatar = (key) => {
    const avatarKeys = {
      avatar1: "avatar_1",
      avatar2: "avatar_2",
      avatar3: "avatar_3",
      avatar4: "avatar_4",
      avatar5: "avatar_5",
      uploadAvatar: "upload_avatar",
    };

    setUserData((prev) => ({
      ...prev,
      avatar: avatarKeys[key],
    }));
    setSelectedAvatar(key);
    console.log("Avatar selected:", avatarKeys[key]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <ImageBackground
          source={require("../assets/dashboardbg.png")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <View style={styles.scrollViewContent}>
            <Text style={styles.title}>Edit Your Profile</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                value={userData.phone}
                style={styles.input_disabled}
                disabled
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>UID:</Text>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#aaa"
                value={userData.uid}
                style={styles.input_disabled}
                disabled
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name:</Text>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#aaa"
                onChangeText={(text) =>
                  setUserData({ ...userData, memberName: text })
                }
                value={userData.memberName}
                style={styles.input}
              />
              {nameError ? (
                <Text style={styles.errorText}>{nameError}</Text>
              ) : null}
            </View>

            <Text style={styles.label}>Select an Avatar:</Text>
            <View style={styles.avatarContainer}>
              {Object.keys(avatars).map((key) => (
                <TouchableOpacity key={key} onPress={() => selectAvatar(key)}>
                  <View
                    style={[
                      styles.avatarWrapper,
                      selectedAvatar === key ? styles.selectedAvatarWrapper : null,
                    ]}
                  >
                    <Image
                      source={avatars[key]}
                      style={styles.avatar}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            {avatarError ? (
              <Text style={styles.errorText}>{avatarError}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.saveButton,
                isLoading ? styles.disabledButton : null,
              ]}
              onPress={saveProfile}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#A903D2", "#410095"]}
                style={styles.gradient}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Save Profile</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                isLoading ? styles.disabledButton : null,
              ]}
              onPress={() => navigation.navigate("nav")}
              disabled={isLoading}
            >
              <LinearGradient
                colors={["#A903D2", "#410095"]}
                style={styles.gradient}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Cancel</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    resizeMode: "contain",
    width: "100%",
  },
  scrollViewContent: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
    marginTop:10
  },
  label: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 10,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#fff2",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    height: 60,
  },
  input_disabled: {
    backgroundColor: "#fff2",
    color: "#fff",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    height: 60,
  },
  saveButton: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  gradient: {
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.6,
  },
  avatarContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  avatarWrapper: {
    padding: 2,
    borderRadius: 32, // half of avatar size + border width
    backgroundColor: "transparent",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatarWrapper: {
    backgroundColor: "#ff00ff", // pink background color
    borderColor: "#fff", // Border color for selected avatar
  },
  errorText: {
    color: "#ff0000",
    marginTop: 5,
    textAlign: "center",
  },
});
