import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';

// Import or define your screens here

const Tab = createTabNavigator();

const TabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home';
              break;
            case 'Wallet':
              iconName = focused ? 'cogs' : 'cogs';
              break;
            case 'Games':
              iconName = focused ? 'user' : 'user';
              break;
            case 'Notifications':
              iconName = focused ? 'bell' : 'bell';
              break;
            case 'Profile':
              iconName = focused ? 'search' : 'search';
              break;
            default:
              iconName = 'circle';
              break;
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >

      <Tab.Screen name="Home" component={Homepage} />
    
    </Tab.Navigator>
  );
};

export default TabNav;
