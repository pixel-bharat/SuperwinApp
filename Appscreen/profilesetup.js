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
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";

export default function ProfileSetupPage() {
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
      if (phoneNumber && uid) {
        setUserData((prev) => ({
          ...prev,
          phoneNumber: phoneNumber,
          uid: uid,
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
  
    // if (!userData.memberName) {
    //   setNameError("Name is required.");
    // }
  
    // if (!userData.avatar) {
    //   setAvatarError("Avatar selection is required.");
    // }
  
    // if (!userData.memberName || !userData.avatar) {
    //   return;
    // }
  
    setIsLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}avatar`, userData, {
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
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        Alert.alert("Error", `Error saving profile: ${error.response.data.message}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request:", error.request);
        Alert.alert("Error", "No response from server. Please try again later.");
      } else {
        // Something happened in setting up the request that triggered an Error
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
            <Text style={styles.title}>Setup Your Profile</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number:</Text>
              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#aaa"
                value={userData.phoneNumber}
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
                  <Image
                    source={avatars[key]}
                    style={[
                      styles.avatar,
                      selectedAvatar === key ? styles.selectedAvatar : null,
                    ]}
                  />
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
                  <Text style={styles.buttonText}>Skip it</Text>
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
    marginBottom: 20,
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
    height:60
  },
  input_disabled: {
    backgroundColor: "#fff2",
    color: "#fff5",
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
    height:60
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedAvatar: {
    borderColor: "#A903D2", // Border color for selected avatar
    borderWidth: 4, // Add border width to make the border visible
},
  saveButton: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    marginBottom: 20,
  },
  gradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.5,
  },
});
