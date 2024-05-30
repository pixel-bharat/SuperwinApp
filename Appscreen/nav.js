import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from "@expo/vector-icons"; // Ensure this import is correct
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";


import Homesrc from "./home";
import Profilepage from "./profileScreen";
import Wallet from "./welletScreen";
import RoomScreen from "./roomScreen";
import NotificationScreen from "./notification";

const Tab = createBottomTabNavigator();

export default function Nav() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let label;
          switch (route.name) {
            case "Home":
              iconName = "home";
              label = "Home";
              break;
            case "Profile":
              iconName = focused ? "user" : "user-circle";
              label = "Profile";
              break;
            case "Wallet":
              iconName = "money";
              label = "Wallet";
              break;
              case "notification":
              iconName = "bell";
              label = "Notification";
              break;
            case "gamesScreen":
              iconName = focused ? "gamepad" : "gamepad";
              label = "Games";
              break;
            default:
              iconName = "circle";
              label = "";
          }

          return (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 10,
            }}>
              {focused ? (
                <LinearGradient
                  colors={['rgb(243, 154, 21)', 'rgb(169, 3, 210)']}
                  style={{
                    width: 80,
                    height: 76,
                    borderTopLeftRadius:30,
                    borderBottomRightRadius:30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FontAwesome name={iconName} size={size} color={color} />
                  <Text style={{ color, fontSize: 12 }}>{label}</Text>
                </LinearGradient>
              ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <FontAwesome name={iconName} size={size} color={color} />
                  <Text style={{ color, fontSize: 12 }}>{label}</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarStyle: {
          height: 80,
          backgroundColor: "black",
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 6,
          borderLeftWidth: 0.1,
          borderRightWidth: 0.1,
          borderBottomWidth:0,
          borderTopColor: "#A903D2",
          position: "absolute",
          overflow:"hidden"
        },
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "gray",
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center'
        },
        tabBarLabelStyle: {
          paddingBottom: 5,
          display: 'none'  // Hide the default label
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={Homesrc}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Wallet"
        component={Wallet}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="RoomScreen"
        component={RoomScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profilepage}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}
