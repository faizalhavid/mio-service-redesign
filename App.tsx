import '@react-native-firebase/app';
import { firebase } from '@react-native-firebase/app-check';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import messaging from '@react-native-firebase/messaging';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { extendTheme, NativeBaseProvider } from 'native-base';
import React, { useEffect, useState } from 'react';
import { LogBox, Platform, useColorScheme } from 'react-native';
import codePush, { CodePushOptions } from 'react-native-code-push';
import { setJSExceptionHandler } from 'react-native-exception-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ENV } from './src/commons/environment';
import AppUpdate from './src/components/AppUpdate';
import { AuthProvider } from './src/contexts/AuthContext';
import RootStackNavigation from './src/navigations';
import { navigate, popToPop } from './src/navigations/rootNavigation';
import { StorageHelper } from './src/services/storage-helper';
import { store } from './src/stores';

LogBox.ignoreLogs(['contrast ratio']);

function App() {
  GoogleSignin.configure({
    webClientId: ENV.WEB_CLIENT_ID,
  });
  const isDarkMode = useColorScheme() === 'dark';
  const customTheme = extendTheme({
    config: {
      // initialColorMode: useColorScheme(),
    },
  });
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);

  const requestUserPermission = async () => {
    const authorizationStatus = await messaging().requestPermission({
      provisional: true,
    });

    if (authorizationStatus) {
      // console.log("Permission status:", authorizationStatus);
      getFCMToken();
    }
  };

  const updateInviteUser = async (url: string) => {
    const regex = /[?&]([^=#]+)=([^&#]*)/g;
    const params: any = {};
    let match;
    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
    }
    // const params = new URLSearchParams(_url.searchParams);
    console.log('params', params);
    if (params.email) {
      await StorageHelper.setValue('INVITE_EMAIL', decodeURIComponent(params.email) || '');
      await StorageHelper.setValue('INVITE_RID', params.rid || '');
      await StorageHelper.setValue('INVITE_SACCOUNTID', params.sAccountId || '');
      await StorageHelper.setValue('INVITE_ROLE', params.role || '');
    }
  };

  const handleDynamicLink = (link: any) => {
    if (link?.url) {
      updateInviteUser(link.url);
    }
  };

  const getAppLaunchLink = async () => {
    try {
      const value = await dynamicLinks().getInitialLink();
      console.log('getAppLaunchLink', value);
      if (value) {
        await updateInviteUser(value.url);
        popToPop('Register');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // console.log("handleDynamicLink-1");
    getAppLaunchLink();
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    codePush.checkForUpdate().then((value) => {
      if (value) {
        setHasUpdate(true);
        value.download().then((res) => {
          res.install(codePush.InstallMode.IMMEDIATE);
        });
      }
    });
  }, []);

  useEffect(() => {
    // if (__DEV__) {
    //   firebase.auth().useEmulator("http://localhost:9099");
    // }
    // Enable AppChek
    firebase.appCheck().activate('com.miohomeservices.customer', true);
    // Exception handler
    setJSExceptionHandler((error, isFatal) => {
      console.log('JSError', error);
      console.log('isFatal', isFatal);
      if (!__DEV__) {
        StorageHelper.clear();
        navigate('Welcome');
      }
    }, true);

    // Request Push Permission
    if (Platform.OS === 'ios') {
      requestUserPermission();
    } else {
      getFCMToken();
    }

    // Background Push Message Listener
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
    });
  }, []);

  const getFCMToken = () => {
    StorageHelper.getValue('FCM_DEVICE_TOKEN').then((value) => {
      if (value === null) {
        messaging()
          .getToken()
          .then((token) => {
            StorageHelper.setValue('FCM_DEVICE_TOKEN', token);
          });
      }
    });
  };

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={customTheme}>
        {hasUpdate ? (
          <AppUpdate />
        ) : (
          <AuthProvider>
            <SafeAreaProvider>
              <RootStackNavigation />
            </SafeAreaProvider>
          </AuthProvider>
        )}
      </NativeBaseProvider>
    </Provider>
  );
}

const codePushOptions: CodePushOptions = {
  // installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: codePush.CheckFrequency.MANUAL,
};
export default codePush(codePushOptions)(App);
