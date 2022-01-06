import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type TitleBarProps = {
  logoType: string;
};

export function TitleBar({ logoType }: TitleBarProps) {
  return (
    <>
      {logoType == "color" ? (
        <Image
          style={{ width: 80, height: 30 }}
          source={require("../../assets/images/color-logo.png")}
        />
      ) : (
        <Image
          style={{ width: 80, height: 30 }}
          source={require("../../assets/images/white-logo.png")}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({});
