import React from "react";
import { View, Text, Button } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

//import Homesrc from "./home"; // Assume Start.js is your current file
import Profilepage from "./profileScreen"; // Assume Start.js is your current file

const Tab = createBottomTabNavigator();



function Home({ navigation }) {
  return (
   <View>
    <Text>hello world</Text>
   </View>
  );
}

export default Home;
