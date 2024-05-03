import React from "react";
import { AppRegistry, Easing  } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from "./Appscreen/start";
import LoginPage from "./Appscreen/login";
import Nav from "./Appscreen/nav";
import Homepage from "./Appscreen/home";
import Onboardpage from "./Appscreen/onboarding";
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
          name="nav"
          component={Nav}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginPage}
          options={{
            headerShown: false,
            screenOptions: {
              animation: "fade", // Applies a fade transition. Change to "slide_from_right" for a sliding effect.
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
          name="walletScreen"
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

// This line registers your app component
AppRegistry.registerComponent('main', () => AppNavigator);

export default AppNavigator;
