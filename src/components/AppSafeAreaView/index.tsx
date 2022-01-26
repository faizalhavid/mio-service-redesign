import { Divider, ScrollView, useColorModeValue } from "native-base";
import React from "react";
import { Platform, SafeAreaView } from "react-native";
import { AppStatusBar } from "../../components/AppStatusBar";

type AppSafeAreaViewProps = {
  bg?: string;
  mt?: number;
  statusBarColor?: string;
  children?: React.ReactNode;
};

const AppSafeAreaView = ({
  bg,
  mt,
  statusBarColor,
  children,
}: AppSafeAreaViewProps): JSX.Element => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        backgroundColor: bg || useColorModeValue("white", "black"),
      }}
    >
      <AppStatusBar
        color={statusBarColor || useColorModeValue("white", "black")}
      />
      {/* {Platform.OS === "android" && (
        <Divider thickness={0} mt={mt === undefined ? 100 : mt} />
      )} */}
      {children}
    </SafeAreaView>
  );
};

export default AppSafeAreaView;
