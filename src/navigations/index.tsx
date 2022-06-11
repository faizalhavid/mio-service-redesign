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
import ChooseService from "../screens/Home/ChooseService";
import Payment from "../screens/Home/Payment";
import Booked from "../screens/Home/Booked";
import DashboardTab from "./DashboardTab";
import UpcomingServices from "../screens/Home/UpcomingServices";
import ServiceHistory from "../screens/Home/ServiceHistory";
import ViewServiceDetails from "../screens/Home/ViewServiceDetails";
import VerifyEmail from "../screens/Auth/VerifyEmail";
import { FLAG_TYPE, STATUS } from "../commons/status";
import { StorageHelper } from "../services/storage-helper";
import { useAnalytics } from "../services/analytics";
import ChoosePlan from "../screens/Home/ChoosePlan";
import ChooseDateTime from "../screens/Home/ChooseDateTime";
import ChooseSchedule from "../screens/Home/ChooseSchedule";

export type SuperRootStackParamList = {
  Welcome: {};
  Register: {};
  Login: {};
  Address: { returnTo: string };
  ChooseService: {};
  ChoosePlan: { serviceId: string; mode: "CREATE" | "UPDATE" };
  ChooseSchedule: {};
  ChooseDateTime: { serviceId: string; mode: "CREATE" | "UPDATE" };
  ServiceDetails: {};
  EditServiceDetails: { serviceId: string; mode: "CREATE" | "UPDATE" };
  Payment: {};
  Booked: {};
  Dashboard: {};
  PersonalDetails: {};
  PaymentMethods: {};
  UpcomingServices: {};
  ServiceHistory: {};
  ViewServiceDetails: { orderId: string; subOrderId: string };
  VerifyEmail: {};
};
const RootStack = createNativeStackNavigator<SuperRootStackParamList>();
const index = (): JSX.Element => {
  const [initialScreen, setInitialScreen] = React.useState<
    "Address" | "VerifyEmail" | "Dashboard" | "Welcome"
  >("Welcome");
  const [loading, setLoading] = React.useState(true);

  const { logScreenView } = useAnalytics();

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
      // StorageHelper.removeValue("LEAD_ID"); // Just for testing
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
  const routeNameRef = React.useRef();
  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => RNBootSplash.hide()}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
        if (previousRouteName !== currentRouteName) {
          logScreenView(currentRouteName);
        }
      }}
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
          <RootStack.Screen name="ChooseService" component={ChooseService} />
          <RootStack.Screen
            name="ChoosePlan"
            component={ChoosePlan}
            initialParams={{ serviceId: "", mode: "CREATE" }}
            options={{
              animation: "slide_from_bottom",
            }}
          />
          <RootStack.Screen name="ChooseSchedule" component={ChooseSchedule} />
          <RootStack.Screen
            name="ChooseDateTime"
            component={ChooseDateTime}
            options={{
              animation: "slide_from_bottom",
            }}
          />
          <RootStack.Screen name="Payment" component={Payment} />
          <RootStack.Screen name="Booked" component={Booked} />
          <RootStack.Screen name="Dashboard" component={DashboardTab} />
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
