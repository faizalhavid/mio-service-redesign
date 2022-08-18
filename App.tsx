import React, { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import RootStackNavigation from "./src/navigations";
import { extendTheme, NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";
import "@react-native-firebase/app";
import { AuthProvider } from "./src/contexts/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { firebase } from "@react-native-firebase/app-check";
import messaging from "@react-native-firebase/messaging";
import { ENV } from "./src/commons/environment";
import codePush, { CodePushOptions } from "react-native-code-push";
import { StorageHelper } from "./src/services/storage-helper";
import { Provider } from "react-redux";
import { store } from "./src/stores";
import { setJSExceptionHandler } from "react-native-exception-handler";
import { navigate, popToPop } from "./src/navigations/rootNavigation";
import dynamicLinks from "@react-native-firebase/dynamic-links";

LogBox.ignoreLogs(["contrast ratio"]);

const App = () => {
  GoogleSignin.configure({
    webClientId: ENV.WEB_CLIENT_ID,
  });
  const isDarkMode = useColorScheme() === "dark";
  const customTheme = extendTheme({
    config: {
      // initialColorMode: useColorScheme(),
    },
  });

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
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      params: any = {},
      match;
    while ((match = regex.exec(url))) {
      params[match[1]] = match[2];
    }
    // const params = new URLSearchParams(_url.searchParams);
    console.log("params", params);
    if (params["email"]) {
      await StorageHelper.setValue(
        "INVITE_EMAIL",
        decodeURIComponent(params["email"]) || ""
      );
      await StorageHelper.setValue("INVITE_RID", params["rid"] || "");
      await StorageHelper.setValue(
        "INVITE_SACCOUNTID",
        params["sAccountId"] || ""
      );
      await StorageHelper.setValue("INVITE_ROLE", params["role"] || "");
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
      console.log("getAppLaunchLink", value);
      if (value) {
        await updateInviteUser(value.url);
        popToPop("Register");
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
    // if (__DEV__) {
    //   firebase.auth().useEmulator("http://localhost:9099");
    // }
    // Enable AppChek
    firebase.appCheck().activate("com.miohomeservices.customer", true);
    // Exception handler
    setJSExceptionHandler((error, isFatal) => {
      console.log("JSError", error);
      console.log("isFatal", isFatal);
      if (!__DEV__) {
        StorageHelper.clear();
        navigate("Welcome");
      }
    }, true);

    // Request Push Permission
    if (Platform.OS === "ios") {
      requestUserPermission();
    } else {
      getFCMToken();
    }

    // Background Push Message Listener
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });
  }, []);

  const getFCMToken = () => {
    StorageHelper.getValue("FCM_DEVICE_TOKEN").then((value) => {
      if (value === null) {
        messaging()
          .getToken()
          .then((token) => {
            StorageHelper.setValue("FCM_DEVICE_TOKEN", token);
          });
      }
    });
  };

  return (
    <Provider store={store}>
      <NativeBaseProvider theme={customTheme}>
        <AuthProvider>
          <RootStackNavigation />
        </AuthProvider>
      </NativeBaseProvider>
    </Provider>
  );
};

const codePushOptions: CodePushOptions = {
  installMode: codePush.InstallMode.IMMEDIATE,
  checkFrequency: !__DEV__
    ? codePush.CheckFrequency.ON_APP_START
    : codePush.CheckFrequency.MANUAL,
};
export default codePush(codePushOptions)(App);
