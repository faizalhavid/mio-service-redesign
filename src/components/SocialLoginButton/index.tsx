import { Button, HStack, Text, useContrastText } from "native-base";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppColors } from "../../commons/colors";

type SocialLoginButtonProps = {
  type: "Google" | "Facebook" | "Apple" | undefined;
  onPress: () => void;
};

const SocialLoginButton = ({
  type,
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
        borderColor={"gray.350"}
        // alignContent={"flex-start"}
        // justifyContent={"flex-start"}
        borderWidth={1}
        _pressed={{
          backgroundColor: `#EEEEEEE6`,
        }}
      >
        <HStack space={2}>
          <View>{LOGO()}</View>
          <Text>Signup with {type}</Text>
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
