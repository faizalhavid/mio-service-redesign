import { Button, Text, useAccessibleColors } from "native-base";
import React from "react";

type AuthButtonProps = {
  type: "outline" | "solid";
  label: string;
  subText?: string;
  onPress: () => void;
};

const AuthButton = ({
  type,
  label,
  subText,
  onPress,
}: AuthButtonProps): JSX.Element => {
  const [accessibleColors] = useAccessibleColors();
  return (
    <Button
      bg={type == "solid" ? "#F3CB51" : "transparent"}
      borderColor={"#F3CB51"}
      borderRadius={50}
      width={250}
      height={60}
      variant={type}
      onPress={onPress}
      tintColor={"transparent"}
      _pressed={{
        backgroundColor: type == "solid" ? "#F3CB51E6" : "#F3CB518F",
        borderColor: "#F3CB51",
      }}
    >
      <Text
        color={type == "solid" ? "black" : "white"}
        textAlign={"center"}
        fontWeight={"bold"}
      >
        {label}
      </Text>
      {subText && (
        <Text
          color={type == "solid" ? "#000" : "#fff"}
          textAlign={"center"}
          fontSize={12}
        >
          {subText}
        </Text>
      )}
    </Button>
  );
};

export default AuthButton;
