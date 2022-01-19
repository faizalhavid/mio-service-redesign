import { ScrollView, useColorModeValue } from "native-base";
import React from "react";
import { SafeAreaView } from "react-native";
import { AppStatusBar } from "../../components/AppStatusBar";

type AppSafeAreaViewProps = {
  p?: number;
  bg?: string;
  statusBarColor?: string;
  children?: React.ReactNode;
};

const AppSafeAreaView = ({
  p,
  bg,
  statusBarColor,
  children,
}: AppSafeAreaViewProps): JSX.Element => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        paddingTop: p === undefined ? 100 : p,
        marginTop: 0,
        backgroundColor: bg || useColorModeValue("white", "black"),
        padding: p,
      }}
    >
      <AppStatusBar
        color={statusBarColor || useColorModeValue("white", "black")}
      />
      {children}
    </SafeAreaView>
  );
};

export default AppSafeAreaView;
