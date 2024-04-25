import React from "react";

import { ScrollView, View, Image, ImageBackground, StyleSheet, Text, SafeAreaView, Dimensions } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default function Homepage({ navigation }) {
 
  return (
    <SafeAreaView>
      
            <View>
              <Text >Total Balance</Text>
              <Text>50,684.89</Text>
            </View>
    </SafeAreaView>
  );
}
