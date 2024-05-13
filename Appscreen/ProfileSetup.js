import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileSetup = ({ route, navigation }) => {
  // Initialize state
  const [userData, setUserData] = useState({
    email: "",
    uid: "",
    avatar: null,
    memberName: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Added state for loading

  useEffect(() => {
    // If route.params are provided, use them, otherwise load from storage.
    if (route.params?.email && route.params?.uid) {
      setUserData((prev) => ({
        ...prev,
        email: route.params.email,
        uid: route.params.uid,
      }));
    } else {
      loadUserData();
    }
  }, [route.params]); // Consider dependencies based on your app's behavior

  // Saving data
  const saveUserData = async (email, uid) => {
    try {
      await AsyncStorage.setItem("userEmail", email);
      await AsyncStorage.setItem("userId", uid);
    } catch (error) {
      console.error("Error saving user data to AsyncStorage:", error);
    }
  };

  // Retrieving data
  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem("userEmail");
      const uid = await AsyncStorage.getItem("userId");
      if (email && uid) {
        setUserData((prev) => ({
          ...prev,
          email: email,
          uid: uid,
        }));
      } else {
        console.log("No user data in AsyncStorage.");
      }
    } catch (error) {
      console.error("Failed to load user data from AsyncStorage:", error);
      Alert.alert("Error", "Failed to load user data.");
    }
  };

  // An example list of avatar images
  const avatars = {
    avatar1: require("../assets/avatar/avatar_1.png"),
    avatar2: require("../assets/avatar/avatar_2.png"),
    avatar3: require("../assets/avatar/avatar_3.png"),
    avatar4: require("../assets/avatar/avatar_4.png"),
    avatar5: require("../assets/avatar/avatar_5.png"),
    uploadAvatar: require("../assets/avatar/upload_avatar.png"),
  };
  // Function to handle avatar selection
  const [selectedAvatar, setSelectedAvatarKey] = useState(null);

  const selectAvatar = (key) => {
    const avatarKeys = {
      avatar1: "avatar_1",
      avatar2: "avatar_2",
      avatar3: "avatar_3",
      avatar4: "avatar_4",
      avatar5: "avatar_5",
      uploadAvatar: "upload_avatar",
    };

    const selectAvatar = (key) => {
      setSelectedAvatar(key);
      console.log("Avatar selected:", avatars[key]); // Assuming `avatars` is a dictionary of require statements
    };
    setUserData((prev) => ({
      ...prev,
      avatar: avatarKeys[key], // Sending the filename as a reference
    }));
    console.log("Avatar selected:", avatarKeys[key]);
  };

  const saveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://192.168.1.26:3000/api/avatar",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      Alert.alert("Profile saved successfully!. ");
      // Go to the main application or dashboard
      navigation.navigate("Login");
      console.log("Saved Profile:", response.data);
    } catch (error) {
      console.error("Save profile error:", error);
      alert("Error saving profile: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      ></ImageBackground>

      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Setup Your Profile</Text>
        <Image
          source={require("../assets/Line.png")}
          style={{ marginTop: 16, alignSelf: "center" }}
        ></Image>
        <Text style={styles.heading__sub}>Select your Avatar</Text>
        <Text style={styles.heading__text}>
          This will display as your Profile Picture
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            width: "100%",
            gap: 20,
            paddingVertical: 20,
          }}
        >
          {Object.keys(avatars).map((key, index) => (
            <TouchableOpacity key={index} onPress={() => selectAvatar(key)}>
              <Image
                source={avatars[key]}
                style={[
                  styles.avatar,
                  key === selectedAvatar ? styles.selectedAvatar : null,
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View>
          <Text style={styles.heading__text}>Full Name*</Text>
          <View style={styles.inputContainer}>
            <Image
              source={require("../assets/PersonFill.png")}
              style={styles.icon}
            ></Image>
            <TextInput
              style={styles.input}
              placeholder="Enter Member Name"
              placeholderTextColor="#9E9E9E"
              value={userData.memberName}
              onChangeText={(text) =>
                setUserData((prev) => ({ ...prev, memberName: text }))
              }
              keyboardType="Member Name"
              autoCapitalize="none"
            />
          </View>
          <Text style={styles.heading__text}>
            UID (this is auto generated )
          </Text>
          <View style={styles.inputContainer}>
            <Image
              source={require("../assets/Lock.png")}
              style={styles.icon}
            ></Image>
            <TextInput
              style={styles.input_disable}
              placeholder="UID"
              placeholderTextColor="#9E9E9E"
              value={userData.uid}
              editable={false}
              keyboardType="Member UID"
              autoCapitalize="none"
            />
          </View>
          <Text style={styles.heading__text}>
            Email ID (This account is linked with this email ID )
          </Text>
          <View style={styles.inputContainer}>
            <Image
              source={require("../assets/mail.png")}
              style={styles.icon}
            ></Image>
            <TextInput
              style={styles.input_disable}
              placeholder="Email ID"
              placeholderTextColor="#9E9E9E"
              value={userData.email}
              editable={false}
              keyboardType="Member Email ID"
              autoCapitalize="none"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.loginButton, isLoading ? styles.disabledButton : null]}
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
              <Text style={styles.buttonText}>SAVE PROFILE</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate("nav")}>
            <Text style={styles.skip_it}>SKIP IT</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundStyle: {
    width: "100%",
    height: "80%",
    position: "absolute",
  },

  container: {
    flex: 1,
    padding: 20,
  },
  heading__sub: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 4,
    color: "#9E9E9E",
  },
  heading__text: {
    fontSize: 14,
    margin: 4,
    color: "#9E9E9E",
  },

  avatarContainer: {
    width: "100%",
    flexDirection: "row", // Lays out children in a horizontal line.
    flexWrap: "wrap", // Allows items to wrap to the next line.
    justifyContent: "flex-start", // Aligns children at the start of the main-axis.
    gap: 20,
    paddingVertical: 20,
  },
  avatar: {
    width: 110,// Each avatar takes up one-third of the container width.
    height:110,
    borderWidth: 4, // Adds a border when selected.
    borderRadius: 20,
    borderColor: "#fff",
  },
  selectedAvatar: {
    width: 110,
    height:110, // Maintains the width for selected avatars.
    borderWidth: 4, // Adds a border when selected.
    borderRadius: 20,
    overflow: "hidden",
    borderColor: "#A903D2", // Sets the border color to blue.
  },

  avatar_upload: {
    width: "30%", // Same width as the avatar to align in grid
    aspectRatio: 1, // Keeps width and height the same
    borderRadius: 10, // Rounds the corners
    justifyContent: "center", // Centers the content vertically
    alignItems: "center", // Centers the content horizontally
    marginBottom: 20,
    // Adds space below the row
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff2",
    borderRadius: 10,
    paddingLeft: 16,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 60,
    color: "#fff",
    marginLeft: 16,
  },

  input_disable: {
    flex: 1,
    height: 60,
    color: "#9E9E9E",
    marginLeft: 16,
  },
  icon: {
    width: 20,
    height: 20,
  },

  loginButton: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
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

  skip_it: {
    color: "#A903D2",
    fontSize: 16,
    fontWeight: "bold",
  },

  heading: {
    fontSize: 22,
    fontWeight: "bold",
    margin: 10,
    color: "white",
  },
  footer: {
    padding: 30,
    width: "100%",
    gap: 20,
    alignItems: "center",
  },
});

export default ProfileSetup;
