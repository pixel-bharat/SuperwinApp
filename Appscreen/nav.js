import React from 'react';
import { View, Text, Image, ImageBackground, StatusBar, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; // Import FontAwesome from Expo

import Homesrc from './home';
import Profilepage from './profileScreen';
import Wallet from './welletScreen';

const Tab = createBottomTabNavigator();

export default function Nav() {
  return (
   
 <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user-o';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'money' : 'money';
          }

          // Return the icon component
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          height:50,
          backgroundColor: 'black',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          borderTopWidth: 4,
          borderLeftWidth: 0.1,
          borderRightWidth: 0.1,
          borderTopColor: '#A903D2', 
          position: "absolute"
        },
        tabBarActiveTintColor: '#A903D2',
        tabBarInactiveTintColor: 'gray',
        
        tabBarLabelStyle: {
          paddingBottom: 5, // Adjusts label position for better alignment with the icon
        },
      })}
     
    >
      <Tab.Screen name="Home" component={Homesrc} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={Profilepage} options={{ headerShown: false }}/>
      <Tab.Screen name="Wallet" component={Wallet} options={{ headerShown: false }} />
    </Tab.Navigator>
 
  );
} 