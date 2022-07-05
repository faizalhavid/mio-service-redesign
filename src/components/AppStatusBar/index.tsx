import React from "react";
import { StatusBar, StyleSheet, useColorScheme } from "react-native";

type AppStatusBarProps = {
  color?: string;
};

export function AppStatusBar({ color }: AppStatusBarProps) {
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={"white"}
        translucent={false}
        barStyle={"dark-content"}
        showHideTransition={"slide"}
        hidden={false}
      />
    </>
  );
}

const styles = StyleSheet.create({});
