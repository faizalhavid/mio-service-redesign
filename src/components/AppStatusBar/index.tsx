import React from "react";
import { StatusBar, StyleSheet, useColorScheme } from "react-native";
import { AppColors } from "../../commons/colors";

type AppStatusBarProps = {
  color?: string;
};

export function AppStatusBar({ color }: AppStatusBarProps) {
  const isDarkMode = useColorScheme() === "dark";
  return (
    <StatusBar
        animated
        backgroundColor={AppColors.TEAL}
        barStyle="dark-content"
        showHideTransition="slide"
        hidden={false}
      />
  );
}

const styles = StyleSheet.create({});
