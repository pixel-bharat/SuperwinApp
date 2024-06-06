import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { BackgroundImage } from "react-native-elements/dist/config";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

export default function SettingScreen() {
  const navigation = useNavigation();
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("English");

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
      <BackgroundImage
        source={require("../assets/bankbackground.png")}
        style={styles.backgroundImage}
      >
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
              <Text style={styles.userNameText}>USER_NAME</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("ProfileSetup")}
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
                <Text style={styles.languageSelectText}>
                  {selectedLanguage}
                </Text>
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
          </View>
        </View>
      </BackgroundImage>
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
  backgroundImage: {
    position: "absolute",
    height: height * 0.5,
    width: "100%",
    resizeMode: "contain",
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
});
