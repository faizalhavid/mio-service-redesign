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
import PersonalDetails from "../screens/Home/PersonalDetails";
import PaymentMethods from "../screens/Home/PaymentMethods";
import UpcomingServices from "../screens/Home/UpcomingServices";
import ServiceHistory from "../screens/Home/ServiceHistory";
import ViewServiceDetails from "../screens/Home/ViewServiceDetails";
import VerifyEmail from "../screens/Auth/VerifyEmail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FLAG_TYPE, STATUS } from "../commons/status";
import { StorageHelper } from "../services/storage-helper";

export type SuperRootStackParamList = {
  Welcome: undefined;
  Register: undefined;
  Login: undefined;
  Address: { returnTo: string };
  ChooseService: undefined;
  ServiceDetails: undefined;
  EditServiceDetails: { serviceId: string; mode: "CREATE" | "UPDATE" };
  Payment: undefined;
  Booked: undefined;
  Dashboard: undefined;
  PersonalDetails: undefined;
  PaymentMethods: undefined;
  UpcomingServices: undefined;
  ServiceHistory: undefined;
  ViewServiceDetails: { orderId: string; subOrderId: string };
  VerifyEmail: undefined;
};
const RootStack = createNativeStackNavigator<SuperRootStackParamList>();
const index = (): JSX.Element => {
  const [initialScreen, setInitialScreen] = React.useState<
    "Address" | "VerifyEmail" | "Dashboard" | "Welcome"
  >("Welcome");
  const [loading, setLoading] = React.useState(true);

  const setupInitialScreen = React.useCallback(async () => {
    try {
      let initialSetupStatus = await StorageHelper.getValue(
        FLAG_TYPE.ALL_INITIAL_SETUP_COMPLETED
      );
      if (initialSetupStatus === STATUS.COMPLETED) {
        setInitialScreen("Dashboard");
        return;
      } else {
        setInitialScreen("Welcome");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      StorageHelper.printAllValues();
    }
  }, []);

  React.useEffect(() => {
    setupInitialScreen();
  }, [setupInitialScreen]);
  const navigationOptions: NativeStackNavigationOptions = {
    headerTitle: (props) => <TitleBar logoType="color" {...props} />,
    headerStyle: {
      backgroundColor: "white",
    },
    headerTransparent: true,
    headerTitleAlign: "center",
    headerShadowVisible: false,
    headerBackTitleVisible: false,
    animation: "slide_from_right",
  };
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => RNBootSplash.hide()}
    >
      {!loading && (
        <RootStack.Navigator
          initialRouteName={initialScreen}
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
          <RootStack.Screen name="VerifyEmail" component={VerifyEmail} />
          <RootStack.Screen name="Login" component={Login} />
          <RootStack.Screen
            name="Address"
            component={Address}
            initialParams={{ returnTo: "" }}
          />
          <RootStack.Screen name="ChooseService" component={ChooseService} />
          <RootStack.Screen name="ServiceDetails" component={ServiceDetails} />
          <RootStack.Screen
            name="EditServiceDetails"
            component={EditServiceDetails}
            initialParams={{ serviceId: "", mode: "CREATE" }}
            options={{
              animation: "slide_from_bottom",
            }}
          />
          <RootStack.Screen name="Payment" component={Payment} />
          <RootStack.Screen name="Booked" component={Booked} />
          <RootStack.Screen name="Dashboard" component={DashboardTab} />
          <RootStack.Screen
            name="PersonalDetails"
            component={PersonalDetails}
          />
          <RootStack.Screen name="PaymentMethods" component={PaymentMethods} />
          <RootStack.Screen
            name="UpcomingServices"
            component={UpcomingServices}
          />
          <RootStack.Screen name="ServiceHistory" component={ServiceHistory} />
          <RootStack.Screen
            name="ViewServiceDetails"
            initialParams={{ orderId: "", subOrderId: "" }}
            component={ViewServiceDetails}
          />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
};
export default index;
