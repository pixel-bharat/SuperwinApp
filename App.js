import { AppRegistry } from "react-native";
import React from "react";
import { Easing } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from "./Appscreen/start"; // Assume Start.js is your current file
import LoginPage from "./Appscreen/login"; // Assume Login.js is your new login form file
import Homepage from "./Appscreen/home";
import Onboardpage from "./Appscreen/onboarding"; // Assume Login.js is your new login form file
import ProfileScreen from "./Appscreen/profileScreen";
import WalletScreen from "./Appscreen/welletScreen";
import GamesScreen from "./Appscreen/gamesScreen";
const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start">
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
          screenOptions={{
            headerShown: false,
            animation: "fade", // This applies a fade transition. Change to "slide_from_right" for a sliding effect.
            animationTypeForReplace: "pop",
            gestureEnabled: true,
            gestureDirection: "horizontal",
            transitionSpec: {
              open: {
                animation: "timing",
                config: { duration: 500, easing: Easing.easeInOut },
              },
              close: {
                animation: "timing",
                config: { duration: 500, easing: Easing.easeInOut },
              },
            },
          }}
        />
         <Stack.Screen
          name="home"
          component={Homepage}
          options={{ headerShown: false }}
        /> 
        <Stack.Screen
          name="Onboard"
          component={Onboardpage}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="profileScreen"
          component={ProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="welletScreen"
          component={WalletScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="gamesScreen"
          component={GamesScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
