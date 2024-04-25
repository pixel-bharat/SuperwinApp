import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons'; // If using Expo

import Homesrc from "./home"; // Assume Start.js is your current file
import Profilepage from "./profileScreen"; // Assume Start.js is your current file
import Wallet from "./welletScreen"; // Assume Start.js is your current file


const Tab = createBottomTabNavigator();

function Nav() {
  return (
  //   <Tab.Navigator>
  //   <Tab.Screen name="Home" component={Homesrc} />
  //   <Tab.Screen name="Profile" component={Profilepage} />
  //   <Tab.Screen name="Wallet" component={Wallet} />
  // </Tab.Navigator>




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

          // You can return any component that you like here!
          return <FontAwesome name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: '#0C0517' }, // Set the tab bar background
        
      })}
    >
      <Tab.Screen name="Home" component={Homesrc} />
      <Tab.Screen name="Profile" component={Profilepage} />
      <Tab.Screen name="Wallet" component={Wallet} />
    </Tab.Navigator>
  );
}

export default Nav;
