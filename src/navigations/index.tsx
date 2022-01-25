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
import EditServiceDetails from "../screens/Home/EditServiceDetails";
import Payment from "../screens/Home/Payment";
import Booked from "../screens/Home/Booked";
import DashboardTab from "./DashboardTab";

export type SuperRootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  Address: { mode: string };
  ChooseService: undefined;
  ServiceDetails: { mode: string };
  EditServiceDetails: undefined;
  Payment: undefined;
  Booked: undefined;
  Dashboard: undefined;
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
        initialRouteName="Payment"
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
        <RootStack.Screen
          name="Address"
          component={Address}
          initialParams={{ mode: "" }}
        />
        <RootStack.Screen name="ChooseService" component={ChooseService} />
        <RootStack.Screen
          name="ServiceDetails"
          component={ServiceDetails}
          initialParams={{ mode: "" }}
        />
        <RootStack.Screen
          name="EditServiceDetails"
          component={EditServiceDetails}
          options={
            {
              // animation: "slide_from_bottom",
            }
          }
        />
        <RootStack.Screen name="Payment" component={Payment} />
        <RootStack.Screen name="Booked" component={Booked} />
        <RootStack.Screen name="Dashboard" component={DashboardTab} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};
export default index;
