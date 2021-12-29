import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import React from "react";
import { TitleBar } from "../components/TitleBar/TitleBar";
import Welcome from "../screens/Auth/Welcome";
import { navigationRef } from "./rootNavigation";

export type SuperRootStackParamList = {
  Welcome: undefined;
};
const RootStack = createNativeStackNavigator<SuperRootStackParamList>();
const index = (): JSX.Element => {
  const navigationOptions: NativeStackNavigationOptions = {
    headerShown: true,
    gestureEnabled: false,
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
            headerTitle: (props) => <TitleBar {...props} />,
            headerStyle: {
              backgroundColor: "teal",
            },
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default index;
