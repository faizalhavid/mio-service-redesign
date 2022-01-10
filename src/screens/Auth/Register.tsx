import {
  Box,
  Center,
  Flex,
  HStack,
  Input,
  Text,
  useColorModeValue,
} from "native-base";
import React from "react";
import { Dimensions, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import SocialLoginButton from "../../components/SocialLoginButton";
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigations/rootNavigation";

const content = (
  <>
    <Center mt={100} width={"100%"}>
      <Text fontSize={20}>Create an account</Text>
      <Text fontSize={20}>to manage your service</Text>
    </Center>
    <Flex flexDirection={"column"} flex={1} paddingX={5} mt={10}>
      <Input
        _focus={{
          borderBottomColor: AppColors.SECONDARY,
        }}
        returnKeyType="next"
        clearButtonMode="always"
        autoCapitalize="none"
        placeholder="NAME"
        variant={"underlined"}
        autoCorrect={false}
      />
      <Spacer top={20} />
      <Input
        _focus={{
          borderBottomColor: AppColors.SECONDARY,
        }}
        returnKeyType="next"
        clearButtonMode="always"
        autoCapitalize="none"
        placeholder="PHONE"
        variant={"underlined"}
        autoCorrect={false}
      />
      <Spacer top={20} />
      <Input
        _focus={{
          borderBottomColor: AppColors.SECONDARY,
        }}
        returnKeyType="next"
        clearButtonMode="always"
        autoCapitalize="none"
        placeholder="EMAIL"
        variant={"underlined"}
        autoCorrect={false}
      />
      <Spacer top={20} />
      <Input
        _focus={{
          borderBottomColor: AppColors.SECONDARY,
        }}
        returnKeyType="next"
        clearButtonMode="always"
        autoCapitalize="none"
        placeholder="PASSWORD"
        variant={"underlined"}
        autoCorrect={false}
      />
      <Spacer top={40} />
      <Center _text={{ color: "gray.400" }}>or Signup using</Center>
      <Spacer top={40} />
      <HStack justifyContent={"center"} space={2}>
        <SocialLoginButton type="Google" onPress={() => {}} />
        <SocialLoginButton type="Facebook" onPress={() => {}} />
        <SocialLoginButton type="Apple" onPress={() => {}} />
      </HStack>
    </Flex>
    <FooterButton onPress={() => navigate("Login")} />
  </>
);

const Register = (): JSX.Element => {
  return <AppSafeAreaView content={content} />;
};

export default Register;
