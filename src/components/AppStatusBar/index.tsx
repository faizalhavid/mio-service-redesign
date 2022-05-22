import React from "react";
import { StatusBar, StyleSheet } from "react-native";

type AppStatusBarProps = {
  color?: string;
};

export function AppStatusBar({ color }: AppStatusBarProps) {
  const barStyle = "transparent" === color ? "light-content" : "dark-content";
  return (
    <>
      <StatusBar
        animated={true}
        backgroundColor={"transparent"}
        barStyle={"light-content"}
        translucent={false}
        showHideTransition={"slide"}
        hidden={false}
      />
    </>
  );
}

const styles = StyleSheet.create({});
