/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from "react";
import { useColorScheme } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RootStackNavigation from "./src/navigations";
import { extendTheme, NativeBaseProvider } from "native-base";
import { LogBox } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import "@react-native-firebase/app";
import { AuthProvider } from "./src/contexts/AuthContext";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { firebase } from "@react-native-firebase/app-check";
import { ENV } from "./src/commons/environment";

LogBox.ignoreLogs(["contrast ratio"]);

if (__DEV__) {
  //   auth().useEmulator("http://192.168.0.248:9099");
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
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

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NativeBaseProvider theme={customTheme}>
        <AuthProvider>
          <RootStackNavigation />
        </AuthProvider>
      </NativeBaseProvider>
    </QueryClientProvider>
  );
};

export default App;
