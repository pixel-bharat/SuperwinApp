import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { jwtDecode } from "jwt-decode"; // Correct import
import AsyncStorage from "@react-native-async-storage/async-storage";
//import Nav from "./nav";



const shuffleArray = (array) => {
  const newArray = array.slice(); // Create a copy of the original array
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Swap elements
  }
  return newArray;
};

const imageArray = [
  require("../assets/aviator.png"),
  require("../assets/cartoonrace.png"),
  require("../assets/pooltable.png"),
  require("../assets/subway.png"),
  require("../assets/templerun.png"),
  require("../assets/spinforcash.png"),
  require("../assets/scrabble.png"),
  require("../assets/marvel.png"),
  require("../assets/centa.png"),
  require("../assets/nicke.png"),
  require("../assets/girl.png"),
  require("../assets/cat.png"),
  require("../assets/mareo.png"),
  require("../assets/basketball.png"),
  require("../assets/cricket.png"),
];

export default function Homepage({}) {
  const navigation = useNavigation();

  const [shuffledImages1, setShuffledImages1] = useState([]);
  const [shuffledImages2, setShuffledImages2] = useState([]);
  const [shuffledImages3, setShuffledImages3] = useState([]);
  const [shuffledImages4, setShuffledImages4] = useState([]);
  const [shuffledImages5, setShuffledImages5] = useState([]);

  useEffect(() => {
    setShuffledImages1(shuffleArray(imageArray));
    setShuffledImages2(shuffleArray(imageArray));
    setShuffledImages3(shuffleArray(imageArray));
    setShuffledImages4(shuffleArray(imageArray));
    setShuffledImages5(shuffleArray(imageArray));
  }, []);

  const viewImage = ({ item }) => (
    <TouchableOpacity style={styles.gamecardcnt}>
      <Image source={item} style={styles.image} />
    </TouchableOpacity>
  );

  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      const data = await displayUserData();
      if (data) {
        setUserData(data);
        console.log("User data after JWT decoding:", data);
      } else {
        console.log("No user data available");
        Alert.alert("Login Failed", "No user data available");
      }
    };
    fetchData();
  }, []);

  const displayUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const decoded = jwtDecode(token);
        console.log("Decoded JWT:", decoded);
        return decoded;
      } else {
        console.log("No token found");
        Alert.alert("Login Failed", "Token not found");
      }
    } catch (error) {
      console.error("Error retrieving or decoding token:", error);
      Alert.alert("Login Failed", error.message);
    }
    return null;
  };

  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
      ></ImageBackground>

      <SafeAreaView>
        <ScrollView style={styles.scroll__View}>
          <View style={styles.header}>
            <Image
              source={require("../assets/logomax.png")}
              style={styles.logoheader}
            ></Image>
            <View style={styles.totalmoneyctn}>
              <Text style={styles.balncetext}>Total Balance</Text>
              <View style={styles.totalmoneybackground}>
                <TouchableOpacity style={styles.totalmoneybackground}>
                  <Image source={require("../assets/coin.png")}></Image>

                  <Text style={styles.headingtext}>
                    {userData
                      ? userData.walletBalance || "00"
                      : "Loading user data..."}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image source={require("../assets/refresh.png")}></Image>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.container}>
            <View style={styles.slidertop}></View>

            <Image
              source={require("../assets/Line.png")}
              style={{ marginTop: 16, alignSelf: "center" }}
            ></Image>
            <View style={styles.scrollcntmain}>
              <View style={styles.scrollcards}>
                <View style={styles.promobackground}>
                  <Text style={styles.promotext}>Your Last Played</Text>
                  <TouchableOpacity>
                    <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 1 }}
                      colors={["#A903D2", "#410095"]}
                      style={styles.linearGradientseemore}
                      angle={"45"}
                      useAngle={true}
                    >
                      <Text style={styles.promobtntext}>VIEW ALL</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <ScrollView>
                  <View style={styles.cardscroller}>
                    <FlatList
                      data={shuffledImages1}
                      renderItem={viewImage}
                      keyExtractor={(item, index) => index.toString()}
                      horizontal={true}
                    />
                  </View>
                </ScrollView>

                <View>
                  <Text style={styles.headingtext}>Top Rated Games</Text>
                  <ScrollView>
                    <View style={styles.cardscroller}>
                      <FlatList
                        data={shuffledImages2}
                        renderItem={viewImage}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                      />
                    </View>
                  </ScrollView>
                  <ScrollView>
                    <View style={styles.cardscroller}>
                      <FlatList
                        data={shuffledImages3}
                        renderItem={viewImage}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                      />
                    </View>
                  </ScrollView>
                </View>
                <View>
                  <Text style={styles.headingtext}>Recommmended Games</Text>
                  <ScrollView>
                    <View style={styles.cardscroller}>
                      <FlatList
                        data={shuffledImages4}
                        renderItem={viewImage}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                      />
                    </View>
                  </ScrollView>
                </View>
                <View>
                  <Text style={styles.headingtext}>Sports</Text>
                  <ScrollView>
                    <View style={styles.cardscroller}>
                      <FlatList
                        data={shuffledImages5}
                        renderItem={viewImage}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal={true}
                      />
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
       {/*  <Nav/> */}
      </SafeAreaView>
    </View>
  );
}
const styles = StyleSheet.create({
  gap40: {
    height: 40,
  },

  mainView: {
    flex: 1,
    backgroundColor: "#000",
    paddingBottom: 100,
  },

  scroll__View: {
    padding: 16,
  },

  backgroundStyle: {
    width: "100%",
    height: "80%",
    position: "absolute",
  },

  logoheader: {
    width: 60,
    height: 50,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },

  topcntbackground: {
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  topchildcnt1: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  topchildcnt1img: {
    width: "50%",
    overflow: "hidden",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  slidertop: {
    flex: 1, // Adjust based on your layout needs
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    width: Dimensions.get("window").width, // Full width slides
    height: 200, // Fixed height for each slide
    justifyContent: "center",
    alignItems: "center",
  },
  slideImage: {
    width: "100%", // Full width of the slide
    height: "100%", // Full height of the slide
    resizeMode: "cover", // Cover the whole slide area
  },

  img: {
    width: "100%", // Set width to 50% of the parent container
    height: undefined, // Allow the height to adjust automatically based on aspect ratio
    aspectRatio: 1.75, // Maintain aspect ratio of the image
  },
  image: {
    width: 120,
    height: 120,
  },
  headingtext: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  gamecardcnt: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  scrollcntmain: { paddingVertical: 10 },
  totalmoneyctn: { alignItems: "flex-end" },

  balncetext: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
  totalmoneybackground: { flexDirection: "row", alignItems: "center" },
  slidertop: {
    alignSelf: "center",
    height: 167,
    width: "97%",
    borderWidth: 1,
    borderColor: "grey",
    paddingHorizontal: 10,
  },
  promotext: { color: "white", fontSize: 18, fontWeight: "700" },
  promobackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  linearGradientseemore: {
    borderRadius: 40,
    justifyContent: "center", // Center the button text vertically
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  promocardcnt: { justifyContent: "center", alignItems: "center" },
  promobtntext: { color: "white", fontSize: 16, fontWeight: "700" },
});
