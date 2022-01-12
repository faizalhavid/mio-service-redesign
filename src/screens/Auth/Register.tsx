import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  Text,
  useColorModeValue,
  VStack,
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
    <Center width={"100%"}>
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
      <HStack justifyContent={"center"}>
        <Divider my="5" />
        <Center
          position={"absolute"}
          top={2}
          background={"white"}
          _text={{
            color: "gray.400",
          }}
        >
          or
        </Center>
      </HStack>
      <Spacer top={40} />
      <VStack justifyContent={"center"} space={2} width={"100%"}>
        <SocialLoginButton type="Google" onPress={() => {}} />
        <SocialLoginButton type="Facebook" onPress={() => {}} />
        <SocialLoginButton type="Apple" onPress={() => {}} />
      </VStack>
    </Flex>
    <FooterButton label="CREATE ACCOUNT" onPress={() => navigate("Address")} />
  </>
);

const Register = (): JSX.Element => {
  return <AppSafeAreaView content={content} />;
};

export default Register;
