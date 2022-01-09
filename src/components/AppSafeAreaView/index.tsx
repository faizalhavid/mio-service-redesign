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
        padding: 0,
        margin: 0,
        backgroundColor: "white",
      }}
    >
      {content}
    </SafeAreaView>
  );
};

export default AppSafeAreaView;
