import React from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function ProfileScreen({ navigation }) {
  // Destructure navigation directly from props
  return (
    <View style={styles.mainView}>
      <ImageBackground
        source={require("../assets/Maskbackround.png")}
        style={styles.backgroundStyle}
      ></ImageBackground>
    
    <SafeAreaView >
      
      <ScrollView>
        <View style={styles.container}>
          <Image source={require("../assets/profile.png")}></Image>
          <View style={styles.profileView}>
            <View style={styles.memberView}>
              <Image
                source={require("../assets/star.png")}
                style={{ width: 20, height: 20 }}
              ></Image>
              <Text style={styles.membernametext}>Member name</Text>
            </View>

            <View style={styles.uidVeiw}>
              <View style={styles.uidbackground}>
                <Text style={styles.uidtext}>UID</Text>
                <Text style={styles.uidtext}>456732420</Text>
              </View>

              <Image
                source={require("../assets/Transfer.png")}
                style={{ marginLeft: 6 }}
              ></Image>
            </View>

            <Text style={styles.lastlogintext}>
              Last login:2024-11-23, 18:16:23
            </Text>
          </View>
          <StatusBar style="auto" />
        </View>
        <View style={styles.gap10}></View>
        <Image
          source={require("../assets/Line.png")}
          style={{ marginTop: 16,alignSelf:'center' }}
        ></Image>
      
        
        <View style={styles.gap10}></View>
        <View style={styles.cardView}>
          <Image
            source={require("../assets/Background.png")}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              borderRadius: 10,
            }}
          ></Image>
          <TouchableOpacity>
            <Image
              source={require("../assets/Share.png")}
              style={{ alignSelf: "flex-end" }}
            ></Image>
          </TouchableOpacity>
          <View style={styles.cardmember}>
            <View style={styles.memberView}>
              <Image
                source={require("../assets/star.png")}
                style={{ width: 20, height: 20 }}
              ></Image>
              <Text style={styles.membernametext2}>Member name</Text>
            </View>

            <View style={styles.uidVeiw}>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                colors={["#FFE590", "#FFC600"]}
                style={{
                  width: 119,
                  height: 27,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 4,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    color: "#2A2A2A",
                    fontSize: 14,
                    marginRight: 12,
                  }}
                >
                  {"UID:"}
                </Text>
                <Text
                  style={{
                    color: "#2A2A2A",
                    fontSize: 14,
                  }}
                >
                  {"45938630"}
                </Text>
              </LinearGradient>
            </View>
          </View>
        </View>
        <View style={styles.gap20}></View>
        <View style={styles.moneycardbackgroung}>
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 14,
              marginBottom: 1,
            }}
          >
            {"Total Balance"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Image
              source={require("../assets/coin.png")}
              resizeMode={"stretch"}
              style={{
                width: 32,
                height: 32,
                marginRight: 8,
              }}
            />
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                marginRight: 11,
              }}
            >
              {"50,684.89"}
            </Text>
            <Image
              source={require("../assets/reuse.png")}
              resizeMode={"stretch"}
              style={{
                width: 32,
                height: 32,
                marginRight: 8,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Image
                source={require("../assets/moneybag.png")}
                resizeMode={"stretch"}
                style={{
                  width: 32,
                height: 32,
                marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  marginHorizontal: 8,
                }}
              >
                {"Deposit"}
              </Text>
            </View>
            <Image source={require("../assets/vrticalline.png")}></Image>

            <View>
              <Image
                source={require("../assets/money.png")}
                resizeMode={"stretch"}
                style={{
                  width: 32,
                height: 32,
                marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  marginHorizontal: 8,
                }}
              >
                {"Withdraw"}
              </Text>
            </View>
            <Image source={require("../assets/vrticalline.png")}></Image>

            <View>
              <Image
                source={require("../assets/bookmark.png")}
                resizeMode={"stretch"}
                style={{
                  width: 32,
                height: 32,
                marginRight: 8,
                }}
              />
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 14,
                  marginHorizontal: 8,
                }}
              >
                {"Membership"}
              </Text>
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
        <View style={styles.logoutbtn}>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            colors={["#A903D2", "#410095"]}
            style={styles.linearGradient}
            angle={"45"}
            useAngle={true}
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
    paddingVertical:20,
    paddingHorizontal:10,
  },

  backgroundStyle: {
    width: "100%",
    height: 400,
    justifyContent: "flex-end",
    alignItems: "center",
    position: "absolute",
  },

  memberView: {
    height: 25,
    flexDirection: "row",
    width: 160,
    alignItems: "center",
  },

  star: { 
    width: 30 
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
    color: "white" 
  },

  lastlogintext: { 
    fontSize: 12, 
    fontWeight: "400", 
    color: "#FFF" 
  },
  
  cardView: { 
    height: 212 ,  
    marginHorizontal:10,
  },

  profileView: { 
    marginLeft: 16, 
    height: 80, 
    justifyContent: "space-between" },

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
    marginHorizontal:10,
  },

  accountText: {
    fontWeight: "700",
    fontSize: 18,
    color: "rgba(255, 255, 255, 1)",
    paddingHorizontal:10,
  },

  accountcard: {
    paddingHorizontal:10,
  },

  firstView: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
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
    paddingHorizontal:10,
    marginRight:"4%",
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
    paddingHorizontal:10,
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
  logoutbtn:{
    paddingHorizontal:10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

});
