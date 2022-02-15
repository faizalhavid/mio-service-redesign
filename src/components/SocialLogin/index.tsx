import { HStack, Divider, Center, VStack } from "native-base";
import React from "react";
import { Platform } from "react-native";
import SocialLoginButton from "../SocialLoginButton";
import Spacer from "../Spacer";

type SocialLoginProps = {
  label: "Signup" | "Login";
  loginWithGoogle?: () => void;
};

const SocialLogin = ({
  label,
  loginWithGoogle,
}: SocialLoginProps): JSX.Element => {
  return (
    <>
      {Platform.OS === "android" && (
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
      )}
      <Spacer top={20} />
      <VStack justifyContent={"center"} space={2} width={"100%"}>
        {Platform.OS === "android" && loginWithGoogle && (
          <SocialLoginButton
            label={label}
            type="Google"
            onPress={loginWithGoogle}
          />
        )}
        {/* <SocialLoginButton type="Facebook" onPress={() => {}} /> */}
        {/* <SocialLoginButton type="Apple" onPress={loginWithApple} /> */}
      </VStack>
    </>
  );
};

export default SocialLogin;
