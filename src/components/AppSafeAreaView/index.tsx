import {
  Center,
  Divider,
  ScrollView,
  Spinner,
  Text,
  useColorModeValue,
  View,
  VStack,
} from "native-base";
import React from "react";
import { Platform, SafeAreaView } from "react-native";
import { AppColors } from "../../commons/colors";
import { AppStatusBar } from "../../components/AppStatusBar";

type AppSafeAreaViewProps = {
  bg?: string;
  mt?: number;
  statusBarColor?: string;
  children?: React.ReactNode;
  loading?: boolean;
};

const AppSafeAreaView = ({
  bg,
  mt,
  statusBarColor,
  children,
  loading,
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
      {Platform.OS === "android" && (
        <Divider thickness={0} mt={mt === undefined ? 100 : mt} />
      )}
      {loading && (
        <View
          position={"absolute"}
          width={"100%"}
          height={"100%"}
          bg={"rgba(0,0,0,0.5)"}
          zIndex={999}
          justifyContent={"center"}
        >
          <Center>
            <VStack>
              <Spinner size="lg" color={AppColors.PRIMARY} />
              {/* <Text mt={10}>Loading</Text> */}
            </VStack>
          </Center>
        </View>
      )}
      {children}
    </SafeAreaView>
  );
};

export default AppSafeAreaView;
