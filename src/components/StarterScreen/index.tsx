import React from "react";
import {
  Button,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { AppColors } from "../../commons/colors";

type StarterScreenProps = {
  screenName: string;
  navigateTo: string;
};

export function StarterScreen({ navigateTo, screenName }: StarterScreenProps) {
  return (
    <>
      <View
        style={{
          height: Dimensions.get("window").height / 2,
        }}
      >
        <Text
          style={{
            color: AppColors.primary,
            textAlign: "center",
            fontSize: 22,
            padding: 50,
          }}
        >
          {screenName}
        </Text>
      </View>
      <View
        style={{
          height: Dimensions.get("window").height / 2,
          padding: 50,
        }}
      >
        <Button
          title={navigateTo}
          onPress={() => {
            // navigate(navigateTo);
          }}
        >
          Go to {navigateTo}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({});
