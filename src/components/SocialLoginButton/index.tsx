import { Button, HStack, Text, useContrastText } from "native-base";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppColors } from "../../commons/colors";

type SocialLoginButtonProps = {
  label: "Signup" | "Login";
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
    <TouchableOpacity onPress={() => onPress()}>
      <Button
        borderRadius={50}
        width={"100%"}
        height={10}
        onPress={onPress}
        bg={"transparent"}
        borderColor={"gray.100"}
        bgColor={"gray.100"}
        // alignContent={"flex-start"}
        // justifyContent={"flex-start"}
        borderWidth={1}
        _pressed={{
          backgroundColor: `#EEEEEEE6`,
        }}
      >
        <HStack space={2}>
          <View>{LOGO()}</View>
          <Text>
            {label} with {type}
          </Text>
        </HStack>
      </Button>
    </TouchableOpacity>
  );
};

export default SocialLoginButton;

const styles = StyleSheet.create({
  logo: {
    width: 20,
    height: 20,
  },
});
