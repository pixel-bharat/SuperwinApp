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
import notifee, { AndroidStyle } from '@notifee/react-native';

interface UserData {
  phoneNumber: string;
  uid: string;
  avatar: string | null;
  memberName: string;
}

export default function ProfileSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [avatarError, setAvatarError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    phoneNumber: "",
    uid: "",
    avatar: null,
    memberName: "",
  });

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
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
        setUserData({
          phoneNumber: "",
          uid: "",
          avatar: null,
          memberName: "",
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("Error", "Failed to fetch user data.");
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
          memberName: name || '',
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

    if (!userData.memberName) {
      setNameError("Name is required.");
      return;
    }

    if (!userData.avatar) {
      setAvatarError("Avatar selection is required.");
      return;
    }

    setIsLoading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      let uid = await AsyncStorage.getItem("userId");
      let phoneNumber = await AsyncStorage.getItem("phoneNumber");

      if (!uid || !phoneNumber) {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        uid = decodedToken.userId;
        phoneNumber = decodedToken.phoneNumber;
      }

      if (!uid || !phoneNumber) {
        Alert.alert("Error", "User ID and phone number are required. Please try again later.");
        setIsLoading(false);
        return;
      }

      const updatedUserData = {
        ...userData,
        uid,
        phoneNumber,
      };

      const response = await axios.post(`${BASE_URL}api/users/avatar`, updatedUserData, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      await AsyncStorage.setItem("userToken", response.data.token);

      Alert.alert("Profile saved successfully!");
      handleNotifeeNotification();
      navigation.navigate("nav");
    } catch (error) {
      console.error("Save profile error:", error);
      Alert.alert("Error", "Failed to save profile. Please try again.");
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

  const selectAvatar = (key: string) => {
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
  };

  const handleNotifeeNotification = async (): Promise<void> => {
    await notifee.requestPermission();

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    await notifee.displayNotification({
      title: 'Profile successfully saved!',
      body: `Your profile has been successfully saved.`,
      android: {
        channelId,
        pressAction: { id: 'default' },
        style: {
          type: AndroidStyle.BIGPICTURE,
          picture: '../assets/adaptive-icon.png',
        },
      },
    });
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
                editable={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>UID:</Text>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#aaa"       
                value={userData.uid}
                style={styles.input_disabled}
                editable={false}
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
                <Text style={styles.buttonText}>Cancel</Text>
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
    marginTop: 10
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
    borderRadius: 32,
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
    backgroundColor: "#ff00ff",
    borderColor: "#fff",
  },
  errorText: {
    color: "#ff0000",
    marginTop: 5,
    textAlign: "center",
  },
});
