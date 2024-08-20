import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { faBold } from "@fortawesome/free-solid-svg-icons";
import BASE_URL from "../backend/config/config";

const { width, height } = Dimensions.get("window");

export default function SettingScreen() {
  const navigation = useNavigation();

  const avatars = {
    avatar_1: require("../assets/avatar/avatar_1.png"),
    avatar_2: require("../assets/avatar/avatar_2.png"),
    avatar_3: require("../assets/avatar/avatar_3.png"),
    avatar_4: require("../assets/avatar/avatar_4.png"),
    avatar_5: require("../assets/avatar/avatar_5.png"),
    uploadAvatar: require("../assets/avatar/upload_avatar.png"),
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [userData, setUserData] = useState(null); // Initialize with null or {}
    useEffect(() => {
      fetchUserData();
      console.log("userdata is ", userData);
    }, []);

    useEffect(() => {
      if (userData) {
        fetchSettings();
      }
      console.log("userdata is ", userData);
    }, [userData]);

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

    const fetchSettings = async () => {
      try {
        console.log("Fetching Settings", userData);
        const token = await AsyncStorage.getItem("userToken");
        console.log("token is THIS BRO", token);
        const response = await fetch(`${BASE_URL}api/settings/settings?uid=${userData.uid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });
    console.log("Response Status:", response.status);
        if (!response.ok) {
          throw new Error(`Failed to fetch settings: ${response.status}`);
        }
        const data = await response.json();
    
        console.log("Fetched Settings:", data);
        setIsChecked(data.pushNotification);
        setIsChecked2(data.inboxNotification);
        setSelectedLanguage(data.selectedLanguage);
      } catch (error) {
        console.error("Error fetching settings:", error);
        Alert.alert("Error", "Failed to fetch settings. Please try again.");
      }
    };
    

  const saveSettings = async () => {
    try {
      console.log("Saving settings...", userData);
      const response = await fetch(`${BASE_URL}api/settings/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

        },
        body: JSON.stringify({
          uid: userData.uid,
          pushNotification: isChecked,
          inboxNotification: isChecked2,
          selectedLanguage,
        }),

      });
      

      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      console.log("Settings saved successfully");

      fetchSettings(); // Refresh settings after save
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings. Please try again.");
    }
  };

  const toggleCheckButton = () => {
    setIsChecked(!isChecked);
  };

  const toggleCheckButton2 = () => {
    setIsChecked2(!isChecked2);
  };

  const toggleLanguageList = () => {
    setShowLanguages(!showLanguages);
  };

  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    setShowLanguages(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.in_cont}>
        <View style={styles.headingCnt}>
          <TouchableOpacity onPress={() => navigation.goBack() }>
       
            <Image
              source={require("../assets/back.png")}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.mainHeading}>Settings</Text>
        </View>

        <View style={styles.editProfileCnt}>
          <View style={styles.usernameCnt}>
            {userData && userData.avatar ? (
              <Image source={avatars[userData.avatar]} style={styles.pro_pic} />
            ) : (
              <Image
                source={require("../assets/girlProfile.png")}
                style={styles.profileImage}
              />
            )}

            <Text style={styles.userNameText}>
              {userData ? userData.name : ""}
              
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("editProfile", {
                uid: userData.uid,
                phoneNumber: userData.phoneNumber,
              })
            }
          >
            <Image source={require("../assets/profileCheck.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.notifmaincnt}>
          <View style={styles.pushNotiCnt}>
            <Text style={styles.textNotification}>Push Notification</Text>
            <TouchableOpacity onPress={toggleCheckButton}>
              <Image
                style={styles.checkButton}
                source={
                  isChecked
                    ? require("../assets/unchecked.png")
                    : require("../assets/checked.png")
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.pushNotiCnt}>
            <Text style={styles.textNotification}>Inbox Notification</Text>
            <TouchableOpacity onPress={toggleCheckButton2}>
              <Image
                style={styles.checkButton}
                source={
                  isChecked2
                    ? require("../assets/unchecked.png")
                    : require("../assets/checked.png")
                }
              />
            </TouchableOpacity>
          </View>
          <View style={styles.pushNotiCnt}>
            <Text style={styles.textNotification}>Language</Text>
            <TouchableOpacity onPress={toggleLanguageList}>
              <Text style={styles.languageSelectText}>{selectedLanguage}</Text>
            </TouchableOpacity>
          </View>
          {showLanguages && (
            <View style={styles.languageList}>
              {["English", "Spanish", "French", "German", "Chinese"].map(
                (language) => (
                  <TouchableOpacity
                    key={language}
                    onPress={() => selectLanguage(language)}
                  >
                    <Text style={styles.languageOption}>{language}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          )}

          {/* Save button */}
          <TouchableOpacity onPress={saveSettings} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  in_cont: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  headingCnt: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 33,
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
  editProfileCnt: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notifmaincnt: {
    marginVertical: 34,
  },
  usernameCnt: {
    flexDirection: "row",
    alignItems: "center",
  },
  userNameText: {
    color: "white",
    paddingLeft: 16,
    fontSize: 20,
    font: faBold,
  },
  pro_pic: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 0,
    marginLeftLeft: 20,
  },
  pushNotiCnt: {
    display: "flex",
    width: width * 0.9,
    height: 66,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.10)",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 8,
  },
  textNotification: {
    color: "white",
    fontSize: 18,
    fontWeight: "400",
  },
  checkButton: {
    height: 20,
    width: 20,
  },
  languageSelectText: {
    color: "grey",
    fontSize: 14,
    fontWeight: "400",
  },
  languageList: {
    display: "flex",
    padding: 6,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  languageOption: {
    color: "rgba(254, 254, 254, 1)",
    fontSize: 16,
    width: width * 0.9,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(84, 84, 88, 0.36)",
    marginVertical: 2,
    textAlign: "center",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#A903D2",
    borderRadius: 10,
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});