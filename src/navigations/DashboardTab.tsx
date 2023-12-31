import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'native-base';
import React from 'react';
import { SvgCss } from 'react-native-svg';
import { HOME_ICON, PROFILE_ICON, SERVICES_ICON } from '../commons/assets';
import { AppColors } from '../commons/colors';
import { TabBarComponent } from '../components/BottomTabBar';
import { useAuthenticatedUser } from '../hooks/useAuthenticatedUser';
import Home from '../screens/Dashboard/Home';
import Profile from '../screens/Dashboard/Profile';
import Services from '../screens/Dashboard/Services';

export type DashboardTabParamList = {
  Home: undefined;
  Services: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator();

function HomeStack() {
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
}
function ProfileStack() {
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
}

function ServicesStack() {
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
}

const Tab = createBottomTabNavigator<DashboardTabParamList>();
function DashboardTab() {
  const tabBarOptions: BottomTabNavigationOptions = {
    tabBarShowLabel: true,
  };
  const isAuthenticated = useAuthenticatedUser();

  return (
    <Tab.Navigator
      tabBar={TabBarComponent}
      screenOptions={{
        tabBarStyle: {
          height: 75,
          paddingBottom: 10,
          // borderRightWidth: 1,
          // borderRightColor: "#fff",
          // backgroundColor: AppColors.DARK_TEAL,
        },
        // tabBarActiveTintColor: "#fff",
        tabBarIconStyle: {
          marginBottom: -20,
        },
        tabBarLabelStyle: {
          // marginTop: 20,
          // marginBottom: 20,
        },
        // tabBarActiveBackgroundColor: AppColors.TEAL,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <SvgCss width={25} xml={HOME_ICON(focused ? AppColors.TEAL : AppColors.AAA)} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text mt={1} color={focused ? AppColors.TEAL : AppColors.AAA} fontWeight="semibold">
              Home
            </Text>
          ),
          headerShown: false,
        }}
        component={HomeStack}
        name="Home"
      />
      {isAuthenticated && (
        <Tab.Screen
          options={{
            tabBarIcon: ({ focused }) => (
              <SvgCss width={25} xml={SERVICES_ICON(focused ? AppColors.TEAL : AppColors.AAA)} />
            ),
            tabBarLabel: ({ focused }) => (
              <Text mt={1} color={focused ? AppColors.TEAL : AppColors.AAA} fontWeight="semibold">
                Services
              </Text>
            ),
            headerShown: false,
          }}
          component={ServicesStack}
          name="Services"
        />
      )}
      <Tab.Screen
        options={{
          tabBarIcon: ({ focused }) => (
            <SvgCss width={25} xml={PROFILE_ICON(focused ? AppColors.TEAL : AppColors.AAA)} />
          ),
          tabBarLabel: ({ focused }) => (
            <Text mt={1} color={focused ? AppColors.TEAL : AppColors.AAA} fontWeight="semibold">
              Profile
            </Text>
          ),
          headerShown: false,
        }}
        component={ProfileStack}
        name="Profile"
      />
    </Tab.Navigator>
  );
}

export default DashboardTab;
