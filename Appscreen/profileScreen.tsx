import React, { useState, useEffect, useCallback  } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Clipboard, // Import Clipboard from react-native
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../backend/config/config";
import { Share } from "react-native";
// Before


// After

export default function ProfileScreen() {
  const navigation = useNavigation();
const isFocused=useIsFocused();
  const avatars = {
    avatar_1: require("../assets/avatar/avatar_1.png"),
    avatar_2: require("../assets/avatar/avatar_2.png"),
    avatar_3: require("../assets/avatar/avatar_3.png"),
    avatar_4: require("../assets/avatar/avatar_4.png"),
    avatar_5: require("../assets/avatar/avatar_5.png"),
    uploadAvatar: require("../assets/avatar/upload_avatar.png"),
  };

  const [userData, setUserData] = useState(null);
  const fetchUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        setUserData(decoded); // Update user data in state
      } else {
        console.log("No token found");
        Alert.alert("Login Failed", "Token not found");
      }
    } catch (error) {
      console.error("Error retrieving or decoding token:", error);
      Alert.alert("Login Failed", error.message);
    }
  }, []);
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, isFocused]);



 // Function to share the user
 const shareUser = () => {
  console.log("Share User" , userData);
  if (userData.userId) {
    const deepLink = `superwinApp://user/${userData.userId}`;
    Share.share({
      message: `Join me on Superwin! ${deepLink}`,
    })
      .then((result) => console.log(result))
      .catch((error) => console.error(error));
  } else {
    alert("No User Found");
  }
};
  const logoutUser = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        console.log("No token found");
        Alert.alert("Logout Failed", "User not authenticated");
        return;
      }

      const decoded = jwtDecode(token);
      const phoneNumber = decoded.phoneNumber;

      const response = await fetch(`${BASE_URL}api/users/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber }),
      });

      if (response.ok) {
        await AsyncStorage.removeItem("userToken");
        console.log("User logged out successfully");
        navigation.navigate("Login");
      } else {
        const errorText = await response.text();
        console.error("Failed to log out:", errorText);
        Alert.alert("Logout Failed", errorText);
      }
    } catch (error) {
      console.error("Failed to log out:", error);
      Alert.alert("Logout Failed", error.message);
    }
  };


  const copyToClipboard = (text) => {
    Clipboard.setString(text);
    Alert.alert("Copied to clipboard", `User ID '${text}' copied to clipboard.`);
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/Maskbackround.png")}
        style={styles.backgroundStyle}
      ></ImageBackground>

      <SafeAreaView>
        <ScrollView style={styles.Scroll__container}>
          <View style={styles.container}>
            {userData ? (
              <Image source={avatars[userData.avatar]} style={styles.pro_pic} />
            ) : (
              <Text>No Image</Text>
            )}
            <View style={styles.profileView}>
              <View style={styles.memberView}>
                <Image
                  source={require("../assets/star.png")}
                  style={{ width: 20, height: 20 }}
                ></Image>
                {userData ? (
                  <Text style={styles.membernametext}>
                    {userData.name || "No Name"}
                  </Text>
                ) : (
                  <Text>Loading user data...</Text>
                )}
              </View>

              <View style={styles.uidVeiw}>
                <View style={styles.uidbackground}>
                  <Text style={styles.uidtext}>UID: </Text>
                  {userData ? (
                    <TouchableOpacity
                      onPress={() => copyToClipboard(userData.userId)}
                    >
                      <Text style={styles.uidtext}>{userData.userId}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text>Loading user data...</Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={() => copyToClipboard(userData.userId)}
                >
                  <Image
                    source={require("../assets/Transfer.png")}
                    style={{ marginLeft: 6 }}
                  />
                </TouchableOpacity>
              </View>
              {userData ? (
                <Text style={styles.lastlogintext}>
                  {userData.phoneNumber || "loading"}
                </Text>
              ) : (
                <Text>Loading user data...</Text>
              )}
            </View>
            <StatusBar style="auto" />
          </View>
          <View style={styles.gap20}></View>
          <Image
            source={require("../assets/Line.png")}
            style={{ alignSelf: "center" }}
          ></Image>

          <View style={styles.gap20}></View>
          <View style={styles.cardView}>
            <ImageBackground
              source={require("../assets/Background.png")}
              style={styles.backgroundImage}
            >
              <TouchableOpacity  
                onPress={shareUser}
                >
                <Image
                  source={require("../assets/Share.png")}
                  style={styles.shareIcon}
                />
                
              </TouchableOpacity>
              <View style={styles.cardmember}>
                <View style={styles.memberView}>
                  <Image
                    source={require("../assets/star.png")}
                    style={{ width: 20, height: 20 }}
                  />
                  {userData ? (
                    <Text style={styles.membernametext2}>
                      {userData.name || "No Name"}
                    </Text>
                  ) : (
                    <Text>Loading user data...</Text>
                  )}
                </View>

                <View style={styles.uidContainer}>
                  <Text style={styles.uidText}>UID: </Text>
                  {userData ? (
                    <Text style={styles.uidNumber}>{userData.userId}</Text>
                  ) : (
                    <Text>Loading user data...</Text>
                  )}
                </View>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.menu_card}>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => navigation.navigate("bankDetailsScreen")}
            >
              <Image
                style={styles.menu_icon}
                source={require("../assets/locker.png")}
              ></Image>
              <Text style={styles.menu_text}>Bank Details setup</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => navigation.navigate("settingScreen")}
            >
              <Image
                style={styles.menu_icon}
                source={require("../assets/setting.png")}
              ></Image>
              <Text style={styles.menu_text}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menu}
              onPress={() => navigation.navigate("supportScreen")}
            >
              <Image
                style={styles.menu_icon}
                source={require("../assets/support.png")}
              ></Image>
              <Text style={styles.menu_text}>Support</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("../assets/Line.png")}
            style={{
              marginTop: 16,
              justifyContent: "center",
              alignSelf: "center",
            }}
          ></Image>
          <View style={styles.logoutBtn}>
            <TouchableOpacity onPress={logoutUser}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={["#A903D2", "#410095"]}
                style={styles.linearGradient}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={styles.gap10}></View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  gap20: {
    height: 20,
  },

  gap10: {
    height: 10,
  },

  mainView: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
  },
  Scroll__container: {
    paddingHorizontal: 16,
  },
  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 16,
  },

  backgroundStyle: {
    width: "100%",
    height: 400,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
  },

  pro_pic: {
    width: 110, // Each avatar takes up one-third of the container width.
    height: 110,
    borderWidth: 4, // Adds a border when selected.
    borderRadius: 20,
    borderColor: "#fff",
  },

  cardView: {
    width: "100%",
    flex: 1, // You might need to adjust this depending on your layout needs
    position: "relative", // For absolute positioning of the background image
    borderRadius: 10, // Ensures the container itself also has rounded corners
    height: 220,
  },

  backgroundImage: {
    width: "100%",
    height: 220,
    position: "absolute",
    borderRadius: 10, // Match the parent's borderRadius
  },
  shareIcon: {
    alignSelf: "flex-end",
    margin: 16, // Adds some margin to the icon for better touchability
  },
  cardmember: {
    flex: 1, // Adjust based on your content's needs
    justifyContent: "space-between", // Adjust layout of inner items
  },
  memberView: {
    flexDirection: "row",
    alignItems: "center", // Align items in a row
    paddingVertical: 10,
    gap: 6,
  },
  menu_card: {
    flexDirection: "column",
    paddingVertical: 12,
  },
  menu: {
    flexDirection: "row",
    justifyContent: "flex-center",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderRadius: 20,
    backgroundColor: "#0002",
    borderColor: "#545458",
    borderWidth: 1,
    marginVertical: 4,
  },
  menu_icon: {
    width: 32,
    height: 32,
  },
  menu_text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    paddingLeft: 6,
  },

  uidContainer: {
    flexDirection: "row",
    gap: 0,
  },
  uidText: {
    color: "#2A2A2A",
    fontSize: 14,
    padding: 8,
    backgroundColor: "#FFC700",
  },
  uidNumber: {
    color: "#2A2A2A",
    fontSize: 14,
    padding: 8,
    backgroundColor: "#FFE590",
  },

  moneycardBackground: {
    flex: 1, // Use for layout scaling based on the available space
    backgroundColor: "rgba(0, 0, 0, 0.60)", // Using RGBA for background color transparency
    borderRadius: 10, // React Native uses camelCase for CSS properties
    borderWidth: 1, // borderWidth instead of 'border'
    borderColor: "rgba(84, 84, 88, 0.60)", // borderColor for specifying border color
    // React Native does not support backdrop-filter or CSS variables, omit these
    padding: 16, // Padding around the content inside the card
    flexDirection: "column", // Main axis direction for children
    justifyContent: "center", // Alignment of children along the main axis
    alignItems: "center", // Alignment of children along the cross axis
    alignSelf: "stretch", // Stretches to the container's width in the cross axis direction
    gap: 10, // Gap is not supported in React Native. Use margin in child components instead.
    marginHorizontal: 10,
  },
  balanceText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 1,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 32,
    height: 32,
  },
  amountText: {
    color: "#FFFFFF",
    fontSize: 18,
    marginRight: 11,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionContainer: {
    flexDirection: "column",
    alignItems: "center",
    width: "30%",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginHorizontal: 8,
  },
  verticalLine: {
    width: 1, // Specify your line's width
    height: "100%", // Adjust based on your layout needs
    backgroundColor: "#fff3", // Assuming white color for the line
    marginHorizontal: 5,
  },

  star: {
    width: 30,
  },

  uidVeiw: {
    flexDirection: "row",
    height: 19,
    width: 140,
    alignItems: "center",
  },

  uidbackground: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.21)",
    width: 120,
    height: 27,
    borderRadius: 6,
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  membernametext: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    paddingLeft: 6,
  },

  uidtext: {
    fontSize: 14,
    fontWeight: "400",
    color: "white",
  },

  lastlogintext: {
    fontSize: 12,
    fontWeight: "400",
    color: "#FFF",
    paddingTop: 10,
  },

  profileView: {
    marginLeft: 16,
    height: 80,
    justifyContent: "space-between",
  },

  cardmember: {
    height: 60,
    width: 159,
    marginLeft: 20,
    justifyContent: "space-between",
  },

  membernametext2: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(252, 224, 123, 1)",
    paddingLeft: 6,
  },

  moneycardbackgroung: {
    backgroundColor: "#00000099",
    borderColor: "#545458",
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 19,
    paddingHorizontal: 16,
    marginHorizontal: 10,
  },

  linearGradient: {
    marginTop: 20,
    width: "100%",
    height: 64,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoutbtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
