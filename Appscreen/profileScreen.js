import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation();

  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          throw new Error("No token found");
        }
        const response = await fetch("http://192.168.1.13:3000/api/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user data");
        }

        setUserDetails(data);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (!userDetails) {
    return <Text>No user data available.</Text>;
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("userToken");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/Maskbackround.png")}
        style={styles.backgroundStyle}
      ></ImageBackground>

      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <Image source={require("../assets/profile.png")}></Image>
            <View style={styles.profileView}>
              <View style={styles.memberView}>
                <Image
                  source={require("../assets/star.png")}
                  style={{ width: 20, height: 20 }}
                ></Image>
                <Text style={styles.membernametext}>
                  {userDetails.member_name}
                </Text>
              </View>

              <View style={styles.uidVeiw}>
                <View style={styles.uidbackground}>
                  <Text style={styles.uidtext}>UID</Text>
                  <Text style={styles.uidtext}>{userDetails.userId}</Text>
                </View>

                <Image
                  source={require("../assets/Transfer.png")}
                  style={{ marginLeft: 6 }}
                ></Image>
              </View>

              <Text style={styles.lastlogintext}>{userDetails.email}</Text>
            </View>
            <StatusBar style="auto" />
          </View>
          <View style={styles.gap10}></View>
          <Image
            source={require("../assets/Line.png")}
            style={{ marginTop: 16, alignSelf: "center" }}
          ></Image>

          <View style={styles.gap10}></View>
          <View style={styles.cardView}>
            <Image
              source={require("../assets/Background.png")}
              style={styles.backgroundImage}
            />
            <TouchableOpacity>
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
                <Text style={styles.membernametext2}>Member name</Text>
              </View>

              <View style={styles.uidVeiw}>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  colors={["#FFE590", "#FFC600"]}
                  style={styles.uidContainer}
                >
                  <Text style={styles.uidText}>{"UID:"}</Text>
                  <Text style={styles.uidNumber}>{"45938630"}</Text>
                </LinearGradient>
              </View>
            </View>
          </View>
          <View style={styles.gap20}></View>
          <View style={styles.moneycardBackground}>
            <Text style={styles.balanceText}>{"Total Balance"}</Text>
            <View style={styles.balanceContainer}>
              <Image
                source={require("../assets/coin.png")}
                resizeMode={"stretch"}
                style={styles.icon}
              />
              <Text style={styles.amountText}>{"50,684.89"}</Text>
              <Image
                source={require("../assets/reuse.png")}
                resizeMode={"stretch"}
                style={styles.icon}
              />
            </View>
            <View style={styles.rowContainer}>
              <View style={styles.sectionContainer}>
                <Image
                  source={require("../assets/moneybag.png")}
                  resizeMode={"stretch"}
                  style={styles.icon}
                />
                <Text style={styles.actionText}>{"Deposit"}</Text>
              </View>
              <Image
                source={require("../assets/vrticalline.png")}
                style={styles.verticalLine}
              />
              <View style={styles.sectionContainer}>
                <Image
                  source={require("../assets/money.png")}
                  resizeMode={"stretch"}
                  style={styles.icon}
                />
                <Text style={styles.actionText}>{"Withdraw"}</Text>
              </View>
              <Image
                source={require("../assets/vrticalline.png")}
                style={styles.verticalLine}
              />
              <View style={styles.sectionContainer}>
                <Image
                  source={require("../assets/bookmark.png")}
                  resizeMode={"stretch"}
                  style={styles.icon}
                />
                <Text style={styles.actionText}>{"Membership"}</Text>
              </View>
            </View>
          </View>
          <View style={styles.gap20}></View>
          <Text style={styles.accountText}>Your Account History</Text>
          <View style={styles.gap20}></View>
          <View style={styles.accountcard}>
            <View style={styles.firstView}>
              <View style={styles.firstcard}>
                <Image source={require("../assets/magic-trick.png")}></Image>
                <Text style={styles.magictext}>Game History</Text>
              </View>

              <View style={styles.secondcard}>
                <Image source={require("../assets/copy.png")}></Image>
                <Text style={styles.magictext}>Transaction</Text>
              </View>
            </View>
            <View style={styles.gap20}></View>
            <View style={styles.firstView}>
              <View style={styles.firstcard}>
                <Image source={require("../assets/moneybag.png")}></Image>
                <Text style={styles.magictext}>Deposit</Text>
              </View>
              <View style={styles.secondcard}>
                <Image source={require("../assets/money.png")}></Image>
                <Text style={styles.magictext}>Withdraw</Text>
              </View>
            </View>
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
            <TouchableOpacity onPress={handleLogout}>
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

  container: {
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  backgroundStyle: {
    width: "100%",
    height: 400,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
  },

  cardView: {
    flex: 1, // You might need to adjust this depending on your layout needs
    position: "relative", // For absolute positioning of the background image
    borderRadius: 10, // Ensures the container itself also has rounded corners
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 10, // Match the parent's borderRadius
  },
  shareIcon: {
    alignSelf: "flex-end",
    margin: 10, // Adds some margin to the icon for better touchability
  },
  cardmember: {
    flex: 1, // Adjust based on your content's needs
    justifyContent: "space-between", // Adjust layout of inner items
  },
  memberView: {
    flexDirection: "row",
    alignItems: "center", // Align items in a row
    padding: 10, // Adds padding around the content
  },
  membernametext2: {
    marginLeft: 10, // Add some space between the star icon and text
    color: "#000", // Adjust as needed
    fontSize: 16, // Adjust as needed
  },
  uidVeiw: {
    padding: 10, // Padding around the UID view for layout purposes
  },
  uidContainer: {
    width: 119,
    height: 27,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginBottom: 12,
  },
  uidText: {
    color: "#2A2A2A",
    fontSize: 14,
    marginRight: 12, // Space between "UID:" and the number
  },
  uidNumber: {
    color: "#2A2A2A",
    fontSize: 14,
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

  memberView: {
    height: 25,
    flexDirection: "row",
    width: 160,
    alignItems: "center",
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
  },

  cardView: {
    height: 212,
    marginHorizontal: 10,
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

  uidbackground2: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 229, 144, 1)",
    width: 120,
    height: 27,
    borderRadius: 6,
    justifyContent: "space-evenly",
    alignItems: "center",
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

  accountText: {
    fontWeight: "700",
    fontSize: 18,
    color: "rgba(255, 255, 255, 1)",
    paddingHorizontal: 10,
  },

  accountcard: {
    paddingHorizontal: 10,
  },

  firstView: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  firstcard: {
    height: 64,
    width: "48%",
    backgroundColor: "#00000099",
    borderColor: "#545458",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
    marginRight: "4%",
  },

  secondcard: {
    height: 64,
    width: "48%",
    backgroundColor: "#00000099",
    borderColor: "#545458",
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 10,
  },

  magictext: {
    color: "rgba(255, 255, 255, 1)",
    fontSize: 14,
    fontWeight: "400",
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
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
