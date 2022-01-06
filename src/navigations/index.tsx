import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import React from "react";
import { TitleBar } from "../components/TitleBar/TitleBar";
import Register from "../screens/Auth/Register";
import Welcome from "../screens/Auth/Welcome";
import { navigationRef } from "./rootNavigation";

export type SuperRootStackParamList = {
  Welcome: undefined;
  Register: undefined;
};
const RootStack = createNativeStackNavigator<SuperRootStackParamList>();
const index = (): JSX.Element => {
  const navigationOptions: NativeStackNavigationOptions = {
    headerShown: true,
    gestureEnabled: false,
    // headerBackVisible: false,
  };
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator
        initialRouteName="Welcome"
        screenOptions={navigationOptions}
      >
        <RootStack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerTitle: (props) => <TitleBar logoType="white" {...props} />,
            headerStyle: {
              backgroundColor: "teal",
            },
          }}
        />
        <RootStack.Screen
          name="Register"
          component={Register}
          options={{
            headerTitle: (props) => <TitleBar logoType="color" {...props} />,
            headerStyle: {
              backgroundColor: "white",
            },
            headerTransparent: true,
            headerTitleAlign: "left",
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default index;
