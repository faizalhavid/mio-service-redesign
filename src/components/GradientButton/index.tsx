import { Pressable, Text } from "native-base";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { AppColors } from "../../commons/colors";

type GradientButtonProps = {
  text: string;
  onPress: (param?: any) => void;
  disabled?: boolean;
};

function GradientButton({
  text,
  onPress,
  disabled,
}: GradientButtonProps): JSX.Element {
  return (
    <Pressable disabled={disabled} width="100%" onPress={onPress}>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          colors={[AppColors.TEAL, AppColors.PRIMARY]}
          style={{
            height: 50,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text
            fontSize={16}
            color="white"
            fontWeight="semibold"
            alignSelf="center"
          >
            {text}
          </Text>
        </LinearGradient>
      </Pressable>
  );
}

export default GradientButton;
