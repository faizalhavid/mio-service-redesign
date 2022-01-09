import { Button, Text, useAccessibleColors } from "native-base";
import React from "react";

type AuthButtonProps = {
  type: "outline" | "solid";
  label: string;
  onPress: () => void;
};

const AuthButton = ({ type, label, onPress }: AuthButtonProps): JSX.Element => {
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
      _text={{
        color: type == "solid" ? "black" : "white",
      }}
      _pressed={{
        backgroundColor: type == "solid" ? "#F3CB51E6" : "#F3CB51",
      }}
    >
      {label}
    </Button>
  );
};

export default AuthButton;
