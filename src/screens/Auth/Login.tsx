import { Center, Flex, Input, Text, VStack } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppButton from "../../components/AppButton";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigations/rootNavigation";

const content = (
  <>
    <Flex flexDirection={"column"} flex={1} paddingX={5} mt={10}>
      <Center width={"100%"}>
        <Text fontSize={20}>Login</Text>
      </Center>
      <VStack mt={10}>
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
        <Center>
          <AppButton label="SIGN IN" onPress={() => navigate("Home")} />
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
            onPress={() => navigate("Home")}
          />
        </Center>
      </VStack>
    </Flex>
  </>
);

const Login = (): JSX.Element => {
  return <AppSafeAreaView>{content}</AppSafeAreaView>;
};

export default Login;
