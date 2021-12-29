import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export function TitleBar({ props }: any) {
  return (
    <>
      <Image
        style={{ width: 80, height: 30 }}
        source={require("../../assets/images/white-logo.png")}
      />
    </>
  );
}

const styles = StyleSheet.create({});
