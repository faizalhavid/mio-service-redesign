import {
  Box,
  Center,
  Divider,
  PresenceTransition,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { StyleSheet } from "react-native";
import { SvgCss } from "react-native-svg";
import { COLOR_LOGO } from "../../commons/assets";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import GradientButton from "../../components/GradientButton";
import { navigate } from "../../navigations/rootNavigation";
import LottieView from "lottie-react-native";
import { AppColors } from "../../commons/colors";
import AppButton from "../../components/AppButton";

const Welcome = (): JSX.Element => {
  return (
    <AppSafeAreaView>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <VStack mt={"1/4"} pt={0}>
          <PresenceTransition
            visible={true}
            initial={{
              opacity: 0,
              translateX: 0,
            }}
            animate={{
              opacity: 1,
              translateX: 1,
              transition: {
                duration: 350,
              },
            }}
          >
            <Center>
              <SvgCss width={200} height={70} xml={COLOR_LOGO} />
            </Center>
          </PresenceTransition>
          <Divider thickness={0} mt={30} />
          <VStack alignItems={"center"}>
            <Divider thickness={0} mt={30} />
            <Center>
              <Text fontWeight={"semibold"} fontSize={18}>
                Welcome to Mio Home Services
              </Text>
              <Text fontWeight={"semibold"} color={AppColors.AAA}>
                Your one destination for all the house needs
              </Text>
            </Center>
            <Divider thickness={0} mt={31} />
            <LottieView
              source={require("../../assets/images/welcome.json")}
              autoPlay
              loop
              style={{
                marginTop: 10,
                width: 200,
                height: 200,
              }}
            />
            <Divider thickness={0} mt={30} />
            <Box mx={5} width="80%">
              <GradientButton
                text="Create Account"
                onPress={() => {
                  navigate("Register");
                }}
              />
              <Divider thickness={0} mt={21} />
              <AppButton
                label="Existing user? Login"
                type="outline"
                onPress={async (event) => {
                  navigate("Login");
                }}
              />
            </Box>
          </VStack>
        </VStack>
      </ScrollView>
      {/* </ImageBackground> */}
    </AppSafeAreaView>
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
