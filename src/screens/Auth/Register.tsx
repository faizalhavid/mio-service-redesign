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
import FooterButton from "../../components/FooterButton";
import SocialLoginButton from "../../components/SocialLoginButton";
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigations/rootNavigation";

const Register = (): JSX.Element => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        flexDirection: "column",
        padding: 0,
        margin: 0,
        backgroundColor: useColorModeValue("white", "black"),
      }}
    >
      <Center mt={100} width={"100%"}>
        <Text fontSize={20}>Create an account</Text>
        <Text fontSize={20}>to manage your service</Text>
      </Center>
      <Flex flex={1} paddingX={5} mt={10}>
        <Input
          _focus={{
            borderBottomColor: "teal.700",
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
            borderBottomColor: "teal.700",
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
            borderBottomColor: "teal.700",
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
            borderBottomColor: "teal.700",
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
        <Flex direction="row" justifyContent={"center"}>
          <SocialLoginButton type="Google" onPress={() => {}} />
          <Spacer left={10} />
          <SocialLoginButton type="Facebook" onPress={() => {}} />
          <Spacer left={10} />
          <SocialLoginButton type="Apple" onPress={() => {}} />
        </Flex>
      </Flex>
      <FooterButton onPress={() => navigate("Login")} />
    </SafeAreaView>
  );
};

export default Register;
