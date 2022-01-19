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
        backgroundColor={color || "white"}
        barStyle={barStyle}
        translucent={true}
        showHideTransition={"slide"}
        hidden={false}
      />
    </>
  );
}

const styles = StyleSheet.create({});
