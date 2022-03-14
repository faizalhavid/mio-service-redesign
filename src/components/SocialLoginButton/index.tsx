import {
  AppleButton,
  AppleButtonStyle,
} from "@invertase/react-native-apple-authentication";
import { Button, HStack, Text, useContrastText } from "native-base";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppColors } from "../../commons/colors";

type SocialLoginButtonProps = {
  label: "Sign up" | "Sign in";
  type: "Google" | "Facebook" | "Apple" | undefined;
  onPress: () => void;
};

const SocialLoginButton = ({
  type,
  label,
  onPress,
}: SocialLoginButtonProps): JSX.Element => {
  const LOGO = () => {
    switch (type) {
      case "Google":
        return (
          <Image
            width={20}
            height={20}
            source={require("../../assets/images/google.png")}
            style={styles.logo}
          />
        );
      case "Facebook":
        return (
          <Image
            width={20}
            height={20}
            source={require("../../assets/images/fb.png")}
            style={styles.logo}
          />
        );
      case "Apple":
        return (
          <Image
            width={20}
            height={20}
            source={require("../../assets/images/apple.png")}
            style={styles.logo}
          />
        );
    }
    return <></>;
  };

  return (
    <>
      {type === "Apple" ? (
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE_OUTLINE}
          buttonType={
            label === "Sign in"
              ? AppleButton.Type.SIGN_IN
              : AppleButton.Type.SIGN_UP
          }
          style={{
            width: "100%", // You must specify a width
            height: 45, // You must specify a height
          }}
          onPress={onPress}
        />
      ) : (
        <TouchableOpacity onPress={() => onPress()}>
          <Button
            borderRadius={5}
            // p={5}
            width={"100%"}
            height={"12"}
            onPress={onPress}
            bg={"transparent"}
            borderColor={"#0a0a0a"}
            // bgColor={"gray.100"}
            // alignContent={"flex-start"}
            // justifyContent={"flex-start"}
            borderWidth={0.8}
            _pressed={{
              backgroundColor: `#EEEEEEE6`,
            }}
          >
            <HStack space={2} justifyContent="center" alignItems={"center"}>
              <View>{LOGO()}</View>
              <Text fontSize={16} fontWeight="semibold">
                {label} with {type}
              </Text>
            </HStack>
          </Button>
        </TouchableOpacity>
      )}
    </>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  logo: {
    width: 20,
    height: 20,
  },
});
