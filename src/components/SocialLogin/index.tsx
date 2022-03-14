import { HStack, Divider, Center, VStack } from "native-base";
import React from "react";
import { Platform, StyleSheet } from "react-native";
import SocialLoginButton from "../SocialLoginButton";
import Spacer from "../Spacer";

type SocialLoginProps = {
  label: "Sign up" | "Sign in";
  loginWithGoogle?: () => void;
  loginWithApple?: () => void;
};

const SocialLogin = ({
  label,
  loginWithGoogle,
  loginWithApple,
}: SocialLoginProps): JSX.Element => {
  return (
    <>
      {/* {Platform.OS === "android" && ( */}
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
      {/* )} */}
      <Spacer top={20} />
      <VStack justifyContent={"center"} space={2} width={"100%"}>
        {loginWithGoogle && (
          <SocialLoginButton
            label={label}
            type="Google"
            onPress={loginWithGoogle}
          />
        )}
        {Platform.OS === "ios" && loginWithApple && (
          <SocialLoginButton
            type="Apple"
            onPress={loginWithApple}
            label={label}
          />
        )}
        {/* <SocialLoginButton type="Facebook" onPress={() => {}} /> */}
      </VStack>
    </>
  );
};

export default SocialLogin;
