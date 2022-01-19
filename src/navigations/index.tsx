import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import React from "react";
import { TitleBar } from "../components/TitleBar/TitleBar";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";
import Welcome from "../screens/Auth/Welcome";
import { navigationRef } from "./rootNavigation";
import RNBootSplash from "react-native-bootsplash";
import Address from "../screens/Auth/Address";
import ChooseService from "../screens/Home/ChooseService";
import ServiceDetails from "../screens/Home/ServiceDetails";

export type SuperRootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  Address: undefined;
  ChooseService: undefined;
  ServiceDetails: { mode: string };
};
const RootStack = createNativeStackNavigator<SuperRootStackParamList>();
const index = (): JSX.Element => {
  const navigationOptions: NativeStackNavigationOptions = {
    headerTitle: (props) => <TitleBar logoType="color" {...props} />,
    headerStyle: {
      backgroundColor: "white",
    },
    headerTransparent: true,
    headerTitleAlign: "center",
    headerShadowVisible: false,
    animation: "slide_from_right",
  };
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => RNBootSplash.hide()}
    >
      <RootStack.Navigator
        initialRouteName="Welcome"
        screenOptions={navigationOptions}
      >
        <RootStack.Screen
          name="Welcome"
          component={Welcome}
          options={{
            headerShown: false,
          }}
        />
        <RootStack.Screen name="Register" component={Register} />
        <RootStack.Screen name="Login" component={Login} />
        <RootStack.Screen name="Address" component={Address} />
        <RootStack.Screen name="ChooseService" component={ChooseService} />
        <RootStack.Screen
          name="ServiceDetails"
          component={ServiceDetails}
          initialParams={{ mode: "" }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default index;
