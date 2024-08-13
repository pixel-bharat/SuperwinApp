import {
  ScrollView,
  View,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";

type StartProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, "Start">;
};

const Start: React.FC<StartProps> = ({ navigation }) => {
  return (
    <View style={styles.fullscreen}>
      <ImageBackground
        source={require("../assets/dashboardbg.png")}
        style={styles.backgroundStyle}
        resizeMode="cover"
      >
        <ScrollView style={styles.bgcolor1} contentContainerStyle={styles.container}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <View style={styles.textWrapper}>
            <Text style={styles.headerText}>
              Dive into epic online battles and adventures
            </Text>
            <Text style={styles.descriptionText}>
              Experience thrilling multiplayer games, compete with players worldwide,
              and embark on unforgettable gaming journeys
            </Text>
            <LinearGradient
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1}}
              colors={['#A903D2', '#410095']}
              style={styles.linearGradient}
            >
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => navigation.navigate("Login")}
              >
                <Text style={styles.buttonText}>LETS GO!</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          <StatusBar style="auto" />
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  bgcolor1: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundStyle: {
    width: "100%",
    height: "100%",
    position: "absolute",
    bottom: 0,
  },
  logo: {
    width: 250,
    height: 200,
    resizeMode: "contain",
  },
  textWrapper: {
    alignItems: "center",
    padding: 10,
    width:"100%",
  },
  headerText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#EBEBF5",
    textAlign: "center",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
  },
  linearGradient: {
    marginTop: 20,
    width: "100%",
    height: 60,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Start;
