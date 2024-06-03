import React, { useState, useEffect } from "react";
import { Alert, BackHandler } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Start from "./Appscreen/start";
import LoginPage from "./Appscreen/login";
import Nav from "./Appscreen/nav";
import Homepage from "./Appscreen/home";
import Onboarding from "./Appscreen/onboarding";
import ProfileScreen from "./Appscreen/profileScreen";
import WalletScreen from "./Appscreen/welletScreen";
import RoomScreen from "./Appscreen/roomScreen";
import OtpScreen from "./Appscreen/otp";
import ProfileSetup from "./Appscreen/profilesetup";
import Transactions from "./Appscreen/Transactions";
import addMoney from "./Appscreen/addMoney";
import spendMoney from "./Appscreen/spendMoney";
import ForgetScreen from "./Appscreen/forgetScreen";
import Room from "./Appscreen/room";
import JoinRoomScreen from "./Appscreen/JoinScreen";
import CreateRoom from "./Appscreen/createRoom";
import RoomUser from "./Appscreen/roomUser";

const Stack = createNativeStackNavigator();

function AppNavigator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      // Simulate an authentication check
      const isAuthenticated = true; // Update this with actual authentication logic
      setIsAuthenticated(isAuthenticated);
    };

    checkAuthentication();

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

    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isAuthenticated ? "nav" : "Start"}>
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
          name="ProfileSetup"
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
          name="Transactions"
          component={Transactions}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomScreen"
          component={RoomScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addMoney"
          component={addMoney}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="spendMoney"
          component={spendMoney}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="forgetScreen"
          component={ForgetScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Room"
          component={Room}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="JoinRoom"
          component={JoinRoomScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RoomUser"
          component={RoomUser}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="CreateRoom"
          component={CreateRoom}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
// Register the main component
//AppRegistry.registerComponent('main', () => AppNavigator);
export default AppNavigator;
