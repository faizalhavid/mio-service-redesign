import { Flex } from "native-base";
import React from "react";
import { Image, ImageBackground, StyleSheet } from "react-native";
import { AppStatusBar } from "../../components/AppStatusBar";
import AuthButton from "../../components/AuthButton";
import CheckInternet from "../../components/CheckInternet";
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigations/rootNavigation";

const Welcome = (): JSX.Element => {
  return (
    <>
      <AppStatusBar color={"transparent"} />

      <ImageBackground
        source={require("../../assets/images/intro-bg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <CheckInternet />
        <Flex flexDirection={"column"} flex={1} bg={"rgba(0,0,0,0.3)"} pt={20}>
          <Flex flexDirection={"row"} mt={100} justifyContent={"center"}>
            <Image source={require("../../assets/images/mio-logo-white.png")} />
            <Image
              source={require("../../assets/images/mio-logo-text-white.png")}
            />
          </Flex>
          <Spacer top={180} />
          <Flex flexDirection={"column"} alignItems={"center"}>
            <AuthButton
              type="solid"
              label="LOG IN"
              // subText="if already have an account"
              onPress={() => navigate("Login")}
            />
            <Spacer top={40} />
            <AuthButton
              type="outline"
              label="SIGN UP"
              // subText="if don't have an account?"
              onPress={() => navigate("Register")}
            />
          </Flex>
        </Flex>
      </ImageBackground>
    </>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 42,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});
