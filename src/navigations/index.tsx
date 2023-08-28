import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';
import RNBootSplash from 'react-native-bootsplash';
import { FLAG_TYPE, STATUS } from '../commons/status';
import { TitleBar } from '../components/TitleBar/TitleBar';

import Login from '../screens/Auth/Login';
import Register from '../screens/Auth/Register';
import VerifyEmail from '../screens/Auth/VerifyEmail';
import Welcome from '../screens/Auth/Welcome';
import Booked from '../screens/Home/Booked';
import ChooseDateTime from '../screens/Home/ChooseDateTime';
import ChoosePlan from '../screens/Home/ChoosePlan';
import ChooseSchedule from '../screens/Home/ChooseSchedule';
import ChooseService from '../screens/Home/ChooseService';
import EditAddress from '../screens/Home/EditAddress';
import Payment from '../screens/Home/Payment';
import ServiceHistory from '../screens/Home/ServiceHistory';
import UpcomingServices from '../screens/Home/UpcomingServices';
import ViewServiceDetails from '../screens/Home/ViewServiceDetails';

import SplashScreen from '../screens/Auth/SplashScreen';
import { useAnalytics } from '../services/analytics';
import { StorageHelper } from '../services/storage-helper';
import DashboardTab from './DashboardTab';
import { navigationRef } from './rootNavigation';

export type SuperRootStackParamList = {
  SplashScreen: {};
  Welcome: {};
  Register: {};
  Login: {};
  EditAddress: {
    returnTo: string;
    mode: 'NEW_ADDRESS' | 'UPDATE_ADDRESS';
    id?: string;
  };
  Address: { returnTo: string };
  ChooseService: {};
  ChoosePlan: { serviceId: string; mode: 'CREATE' | 'UPDATE' };
  ChooseSchedule: { serviceId: string };
  ChooseDateTime: { serviceId: string; mode: 'CREATE' | 'UPDATE' };
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
    'Register' | 'Address' | 'VerifyEmail' | 'Dashboard' | 'Welcome' | 'SplashScreen'
  >('Welcome');
  const [loading, setLoading] = React.useState(true);

  const { logScreenView } = useAnalytics();

  const setupInitialScreen = React.useCallback(async () => {
    try {
      const authenticationStatus = await StorageHelper.getValue(FLAG_TYPE.AUTHENTICATED_USER);
      const inviteEmail = await StorageHelper.getValue('INVITE_EMAIL');

      if (inviteEmail) {
        setInitialScreen('Register');
      } else if (auth().currentUser && authenticationStatus === STATUS.TRUE) {
        setInitialScreen('Dashboard');
        return;
      } else {
        setInitialScreen('SplashScreen');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      // StorageHelper.removeValue("LEAD_ID"); // Just for testing
      // StorageHelper.printAllValues();
    }
  }, []);

  React.useEffect(() => {
    setupInitialScreen();
  }, [setupInitialScreen]);
  const navigationOptions: NativeStackNavigationOptions = {
    headerTitle: (props) => <TitleBar logoType="color" {...props} />,
    headerStyle: {
      backgroundColor: 'white',
    },
    headerShown: true,
    // headerTransparent: true,
    headerTitleAlign: 'center',
    headerShadowVisible: false,
    headerBackTitleVisible: false,
    animation: 'slide_from_right',
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
        <RootStack.Navigator initialRouteName={initialScreen} screenOptions={navigationOptions}>
          <RootStack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              headerShown: false,
              headerTransparent: true,
            }}
          />
          <RootStack.Screen
            name="Welcome"
            component={Welcome}
            options={{
              headerShown: false,
              headerTransparent: true,
            }}
          />
          <RootStack.Screen name="Register" component={Register} />
          <RootStack.Screen name="VerifyEmail" component={VerifyEmail} />
          <RootStack.Screen name="Login" component={Login} />
          <RootStack.Screen name="EditAddress" component={EditAddress} />
          <RootStack.Screen name="ChooseService" component={ChooseService} />
          <RootStack.Screen
            name="ChoosePlan"
            component={ChoosePlan}
            initialParams={{ serviceId: '', mode: 'CREATE' }}
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <RootStack.Screen name="ChooseSchedule" component={ChooseSchedule} />
          <RootStack.Screen
            name="ChooseDateTime"
            component={ChooseDateTime}
            options={{
              animation: 'slide_from_bottom',
            }}
          />
          <RootStack.Screen name="Payment" component={Payment} />
          <RootStack.Screen name="Booked" component={Booked} />
          <RootStack.Screen name="Dashboard" component={DashboardTab} />
          <RootStack.Screen name="UpcomingServices" component={UpcomingServices} />
          <RootStack.Screen name="ServiceHistory" component={ServiceHistory} />
          <RootStack.Screen
            name="ViewServiceDetails"
            initialParams={{ orderId: '', subOrderId: '' }}
            component={ViewServiceDetails}
          />
        </RootStack.Navigator>
      )}
    </NavigationContainer>
  );
};
export default index;
