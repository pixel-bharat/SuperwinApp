import React from "react";
import Carousel from "react-native-snap-carousel";
import { ScrollView, View, Image, ImageBackground, StyleSheet, Text, SafeAreaView, Dimensions } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Homepage({ navigation }) {
  const carouselItems = [
    { source: require("../assets/banner1.png") },
    { source: require("../assets/banner2.png") },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.source} resizeMode="contain" style={styles.slideImage} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground source={require("../assets/Maskbackround.png")} resizeMode="stretch" style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/logo.png")} resizeMode="stretch" style={styles.logoImage} />
          </View>
          <View style={styles.balanceContainer}>
            <Image source={require("../assets/rupee.png")} resizeMode="stretch" style={styles.balanceImage} />
            <View style={styles.balanceTextContainer}>
              <Text style={styles.balanceText}>Total Balance</Text>
              <Text style={styles.balanceAmount}>50,684.89</Text>
            </View>
            <Image source={require("../assets/refresh.png")} resizeMode="stretch" style={styles.refreshIcon} />
          </View>
        </ImageBackground>

        <View style={styles.carouselContainer}>
          <Carousel
            data={carouselItems}
            renderItem={renderItem}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={300}
            layout="default"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#191B23",
  },
  header: {
    width: "100%",
    height: 150,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: 70,
    height: 50,
  },
  balanceContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  balanceImage: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  balanceTextContainer: {
    flex: 1,
  },
  balanceText: {
    color: "#FFF",
    fontSize: 16,
  },
  balanceAmount: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  refreshIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  carouselContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  slide: {
    width: 300,
    height: 128,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "floralwhite",
  },
  slideImage: {
    width: "100%",
    height: "100%",
  },
});
