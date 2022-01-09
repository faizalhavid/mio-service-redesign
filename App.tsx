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
import { extendTheme, NativeBaseProvider, StatusBar } from "native-base";
import { LogBox } from "react-native";

LogBox.ignoreLogs(["contrast ratio"]);

const App = () => {
  const isDarkMode = useColorScheme() === "dark";
  const Stack = createNativeStackNavigator();
  const customTheme = extendTheme({
    config: {
      // initialColorMode: useColorScheme(),
    },
  });
  return (
    <NativeBaseProvider theme={customTheme}>
      <RootStackNavigation />
    </NativeBaseProvider>
  );
};

export default App;
