// Frontend: SettingScreen.js
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

const { width, height } = Dimensions.get("window");

const BASE_URL = "http://192.168.1.17:3000"; // Replace with your actual backend URL

export default function SettingScreen() {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [username, setUsername] = useState("USER_NAME"); // Default username

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/settings`);
      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched Settings:", data);
      setUsername(data.username);
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
      const response = await fetch(`${BASE_URL}/api/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
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
      {/* Your UI components */}
      <View style={styles.in_cont}>
        <View style={styles.headingCnt}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/back.png")}
              style={styles.backButton}
            />
          </TouchableOpacity>
          <Text style={styles.mainHeading}>Settings</Text>
        </View>

        <View style={styles.editProfileCnt}>
          <View style={styles.usernameCnt}>
            <Image source={require("../assets/girlProfile.png")} />
            <Text style={styles.userNameText}>{username}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("editProfile")}>
            <Image source={require("../assets/profileCheck.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.notifmaincnt}>
          <View style={styles.pushNotiCnt}>
            <Text style={styles.textNotification}>Push Notification</Text>
            <TouchableOpacity onPress={toggleCheckButton}>
              <Image
                style={styles.checkButton}
                source={isChecked ? require("../assets/unchecked.png") : require("../assets/checked.png")}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.pushNotiCnt}>
            <Text style={styles.textNotification}>Inbox Notification</Text>
            <TouchableOpacity onPress={toggleCheckButton2}>
              <Image
                style={styles.checkButton}
                source={isChecked2 ? require("../assets/unchecked.png") : require("../assets/checked.png")}
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
              {["English", "Spanish", "French", "German", "Chinese"].map(language => (
                <TouchableOpacity key={language} onPress={() => selectLanguage(language)}>
                  <Text style={styles.languageOption}>{language}</Text>
                </TouchableOpacity>
              ))}
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
  userNameText: { color: "white", paddingLeft: 16 },
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
    display: "flex",
    width: width * 0.9,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
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
    fontWeight: "600",
  },
});
