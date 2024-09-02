import React, { useState, useRef, useEffect } from "react";
import { Alert, BackHandler, Linking } from "react-native";
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import your screens
import Start from "./Appscreen/start";
import LoginPage from "./Appscreen/login";
import Nav from "./Appscreen/nav";
import Homepage from './Appscreen/home';
import Onboarding from "./Appscreen/onboarding";
import ProfileScreen from "./Appscreen/profileScreen";
import WalletScreen from "./Appscreen/welletScreen";
import RoomScreen from "./Appscreen/roomScreen";
import OtpScreen from "./Appscreen/otp";
import ProfileSetup from "./Appscreen/profilesetup";
import Transactions from "./Appscreen/Transactions";
import AddMoney from "./Appscreen/addMoney";
import SpendMoney from "./Appscreen/spendMoney";
import ForgetScreen from "./Appscreen/forgetScreen";
import Room from "./Appscreen/room";
import JoinRoomScreen from "./Appscreen/JoinScreen";
import CreateRoom from "./Appscreen/createRoom";
import BankDetailsScreen from "./Appscreen/bankDetailsScreen";
import AddBankDetails from "./Appscreen/addBankDetails";
import SupportScreen from "./Appscreen/supportScreen";
import SettingScreen from "./Appscreen/settingScreen";
import RoomUser from "./Appscreen/roomUser";
import EditProfile from "./Appscreen/editProfile";
import GameWebView from "./Appscreen/GameWebView";

type RootStackParamList = {
  Auth: undefined;
  App: undefined;
};

type AuthStackParamList = {
  Start: undefined;
  Login: undefined;
  OtpScreen: undefined;
  forgetScreen: undefined;
  ProfileScreen: undefined;
  nav: undefined;
};

type AppStackParamList = {
  nav: undefined;
  home: undefined;
  onboarding: undefined;
  ProfileSetup: undefined;
  ProfileScreen: undefined;
  welletScreen: undefined;
  Transactions: undefined;
  RoomScreen: undefined;
  addMoney: undefined;
  spendMoney: undefined;
  adminroom: undefined;
  JoinRoom: undefined;
  RoomUser: undefined;
  CreateRoom: undefined;
  bankDetailsScreen: undefined;
  addBankDetails: undefined;
  supportScreen: undefined;
  settingScreen: undefined;
  editProfile: undefined;
  Login: undefined;
  GameWebView: undefined; // Add GameWebView to AppStackParamList
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const AppStack = createNativeStackNavigator<AppStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Start">
      <AuthStack.Screen name="nav" component={Nav} options={{ headerShown: false }} />
      <AuthStack.Screen name="Start" component={Start} options={{ headerShown: false }} />
      <AuthStack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
      <AuthStack.Screen name="OtpScreen" component={OtpScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="forgetScreen" component={ForgetScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="addMoney" component={AddMoney} options={{ headerShown: false }} />
      <AuthStack.Screen name="spendMoney" component={SpendMoney} options={{ headerShown: false }} />
      <AuthStack.Screen name="bankDetailsScreen" component={BankDetailsScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="addBankDetails" component={AddBankDetails} options={{ headerShown: false }} />
      <AuthStack.Screen name="supportScreen" component={SupportScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="settingScreen" component={SettingScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="editProfile" component={EditProfile} options={{ headerShown: false }} />
      <AuthStack.Screen name="welletScreen" component={WalletScreen} options={{ headerShown: false }} />
      <AuthStack.Screen name="Transactions" component={Transactions} options={{ headerShown: false }} />
      <AuthStack.Screen name="GameWebView" component={GameWebView} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
}

function AppNavigator({ handleLogout }: { handleLogout: () => void }) {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="nav" component={Nav} options={{ headerShown: false }} />
      <AppStack.Screen name="home" component={Homepage} options={{ headerShown: false }} />
      <AppStack.Screen name="onboarding" component={Onboarding} options={{ headerShown: false }} />
      <AppStack.Screen name="ProfileSetup" component={ProfileSetup} options={{ headerShown: false }} />
      <AppStack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="welletScreen" component={WalletScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="Transactions" component={Transactions} options={{ headerShown: false }} />
      <AppStack.Screen name="RoomScreen" component={RoomScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="addMoney" component={AddMoney} options={{ headerShown: false }} />
      <AppStack.Screen name="spendMoney" component={SpendMoney} options={{ headerShown: false }} />
      <AppStack.Screen name="adminroom" component={Room} options={{ headerShown: false }} />
      <AppStack.Screen name="JoinRoom" component={JoinRoomScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="RoomUser" component={RoomUser} options={{ headerShown: false }} />
      <AppStack.Screen name="CreateRoom" component={CreateRoom} options={{ headerShown: false }} />
      <AppStack.Screen name="bankDetailsScreen" component={BankDetailsScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="addBankDetails" component={AddBankDetails} options={{ headerShown: false }} />
      <AppStack.Screen name="supportScreen" component={SupportScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="settingScreen" component={SettingScreen} options={{ headerShown: false }} />
      <AppStack.Screen name="editProfile" component={EditProfile} options={{ headerShown: false }} />
      <AppStack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
      <AppStack.Screen name="GameWebView" component={GameWebView} options={{ headerShown: false }} />
    </AppStack.Navigator>
  );
}

function MainNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    const backAction = () => {
      if (isLoggedIn) {
        Alert.alert("Hold on!", "Do you want to exit the app?", [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          { text: "YES", onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isLoggedIn]);

  const checkLoginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setIsLoggedIn(!!token);
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Handle deep linking
  useEffect(() => {
    const handleOpenURL = (event: any) => {
      console.log('App opened from URL:', event.url);
      if (event.url.startsWith('superwinapp://return')) {
        // Navigate back to the homepage or any other relevant screen
        navigationRef.current?.navigate('Homepage'); // Use navigationRef to navigate
      }
    };

    Linking.addEventListener('url', handleOpenURL);
    return () => Linking.removeEventListener('url', handleOpenURL);
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {isLoggedIn ? (
          <Stack.Screen name="App" options={{ headerShown: false }}>
            {(props) => <AppNavigator {...props} handleLogout={handleLogout} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
