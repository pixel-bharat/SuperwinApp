import React, { useState, useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { Easing } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from "./Appscreen/start";
import LoginPage from "./Appscreen/login";
import Nav from "./Appscreen/nav";
import Homepage from "./Appscreen/home";
import Onboarding from "./Appscreen/onboarding";
import ProfileScreen from "./Appscreen/profileScreen";
import WalletScreen from "./Appscreen/welletScreen";
import GamesScreen from "./Appscreen/gamesScreen";
import OtpScreen from "./Appscreen/otp";
import ProfileSetup from "./Appscreen/ProfileSetup";



const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if the user is already authenticated (e.g., token in AsyncStorage)
    const checkAuthentication = () => {
      const isAuthenticated = true; // Assume the user is already authenticated
      setIsAuthenticated(isAuthenticated);
    };

    checkAuthentication();

    // Add event listener for back button press
    const backAction = () => {
      Alert.alert("Exit App", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove(); // Remove the event listener on component unmount
  }, []);

  const handleLogout = () => {
    // Implement logout functionality here
    setIsAuthenticated(false);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "nav" : "start"}>
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="nav"
          component={Nav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{ headerShown: false }}
          screenOptions={{
            headerShown: false,
            animation: "fade",
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
          name="onboarding"
          component={Onboarding}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtpScreen"
          component={OtpScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ProfileSet"
          component={ProfileSetup}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
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
