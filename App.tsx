import React, { useEffect } from "react";
import { Alert, useColorScheme } from "react-native";
import RootStackNavigation from "./src/navigations";
import { extendTheme, NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";
import "@react-native-firebase/app";
import { AuthProvider } from "./src/contexts/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { firebase } from "@react-native-firebase/app-check";
import { ENV } from "./src/commons/environment";
import codePush, { CodePushOptions } from "react-native-code-push";
import CodePush from "react-native-code-push";
import { StorageHelper } from "./src/services/storage-helper";
import { Provider } from "react-redux";
import { store } from "./src/stores";
import { setJSExceptionHandler } from "react-native-exception-handler";
import { navigate } from "./src/navigations/rootNavigation";

LogBox.ignoreLogs(["contrast ratio"]);

if (__DEV__) {
  // firebase.auth().useEmulator("http://192.168.0.248:9099");
  import("./ReactotronConfig").then(() => {
    // console.log("Reactotron Configured")
  });
}

firebase.appCheck().activate("com.miohomeservices.customer", true);

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

  setJSExceptionHandler((error, isFatal) => {
    console.log("JSError", error);
    console.log("isFatal", isFatal);
    Alert.alert("Something went wrong", "Please login again!", [
      {
        text: "OK",
        onPress: () => {
          StorageHelper.clear();
          navigate("Welcome");
        },
        style: "cancel",
      },
    ]);
  }, true);

  // useEffect(() => {
  //   // PROD_CONFIG
  //   if (!__DEV__) {
  //     CodePush.checkForUpdate().then((value) => {
  //       if (value) {
  //         StorageHelper.setValue("NEW_UPDATE_FOUND", "true");
  //       } else {
  //         StorageHelper.setValue("NEW_UPDATE_FOUND", "false");
  //       }
  //     });
  //   }
  // }, []);

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
