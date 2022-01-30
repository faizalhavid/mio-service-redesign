import {
  Center,
  Divider,
  Flex,
  Input,
  StatusBar,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { Platform } from "react-native";
import { AppColors } from "../../commons/colors";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import Spacer from "../../components/Spacer";
import { navigate, popToPop } from "../../navigations/rootNavigation";

const content = (
  <AppSafeAreaView mt={0} statusBarColor="#fff">
    <Flex mt={100} flexDirection={"column"} flex={1} paddingX={5}>
      <Center width={"100%"}>
        <Text fontSize={20}>Login</Text>
      </Center>
      <VStack mt={10}>
        <AppInput type="email" label="Email" lineWidth={1} />
        <AppInput type="password" label="Password" lineWidth={1} />
        <Spacer top={40} />
        <Center>
          <AppButton label="SIGN IN" onPress={() => popToPop("Dashboard")} />
        </Center>
      </VStack>
      <VStack space="1" position={"absolute"} bottom={10} alignSelf={"center"}>
        <Center size="16" width={"100%"}>
          Already have an account?
        </Center>
        <Center>
          <AppButton
            color={AppColors.SECONDARY}
            label="SIGN UP FOR FREE"
            onPress={() => navigate("Register")}
          />
        </Center>
      </VStack>
    </Flex>
  </AppSafeAreaView>
);

const Login = (): JSX.Element => {
  return <AppSafeAreaView>{content}</AppSafeAreaView>;
};

export default Login;
