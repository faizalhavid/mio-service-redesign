import { Flex, StatusBar, useColorModeValue } from "native-base";
import React from "react";
import {
  Button,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthButton from "../../components/AuthButton";
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigations/rootNavigation";

const Welcome = (): JSX.Element => {
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <ImageBackground
        source={require("../../assets/images/login-bg.jpeg")}
        resizeMode="cover"
        style={styles.image}
      >
        <Flex flexDirection={"column"} flex={1} bg={"rgba(0,0,0,0.5)"}>
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
              onPress={() => navigate("Login")}
            />
            <Spacer top={40} />
            <AuthButton
              type="outline"
              label="SIGN UP"
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
