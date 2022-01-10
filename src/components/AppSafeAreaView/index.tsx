import { useColorModeValue } from "native-base";
import React from "react";
import { SafeAreaView } from "react-native";

type AppSafeAreaView = {
  content: HTMLElement;
};

const AppSafeAreaView = ({ content }: AppSafeAreaView): JSX.Element => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        paddingTop: 70,
        marginTop: 0,
        backgroundColor: useColorModeValue("white", "black"),
      }}
    >
      {content}
    </SafeAreaView>
  );
};

export default AppSafeAreaView;
