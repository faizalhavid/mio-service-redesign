import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Icon } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { HOME_ICON, PROFILE_ICON, SERVICES_ICON } from "../commons/assets";
import { AppColors } from "../commons/colors";
import { TabBarComponent } from "../components/BottomTabBar";
import Home from "../screens/Dashboard/Home";
import Profile from "../screens/Dashboard/Profile";
import Services from "../screens/Dashboard/Services";
import PersonalDetails from "../screens/Home/PersonalDetails";

export type DashboardTabParamList = {
  Home: undefined;
  Services: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="HomeScreen"
    >
      <Stack.Screen name="HomeScreen" component={Home} />
    </Stack.Navigator>
  );
};
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="ProfileScreen"
    >
      <Stack.Screen name="ProfileScreen" component={Profile} />
    </Stack.Navigator>
  );
};

const ServicesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
      initialRouteName="ServicesScreen"
    >
      <Stack.Screen name="ServicesScreen" component={Services} />
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();
const DashboardTab = () => {
  const tabBarOptions: BottomTabNavigationOptions = {
    tabBarShowLabel: true,
  };
  return (
    <Tab.Navigator
      tabBar={TabBarComponent}
      screenOptions={{
        tabBarStyle: {
          height: 75,
          paddingBottom: 0,
          borderRightWidth: 1,
          borderRightColor: "#fff",
          backgroundColor: AppColors.DARK_TEAL,
        },
        tabBarActiveTintColor: "#fff",
        tabBarIconStyle: {
          marginTop: 10,
        },
        tabBarLabelStyle: {
          color: "#fff",
          fontSize: 12,
          paddingBottom: 10,
        },
        tabBarActiveBackgroundColor: AppColors.TEAL,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <SvgCss width={40} xml={HOME_ICON} />,
        }}
        component={HomeStack}
        name="Home"
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <SvgCss width={40} xml={SERVICES_ICON} />
          ),
        }}
        component={ServicesStack}
        name="Services"
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => <SvgCss width={40} xml={PROFILE_ICON} />,
        }}
        component={ProfileStack}
        name="Profile"
      />
    </Tab.Navigator>
  );
};

export default DashboardTab;
