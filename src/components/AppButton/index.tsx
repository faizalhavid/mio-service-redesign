import { Button, useContrastText } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type AppButtonProps = {
  onPress: (param?: any) => void;
  color?: string;
  type?: "outline" | "solid";
  label: string;
  disabled?: boolean;
};

const AppButton = ({
  label,
  color,
  onPress,
  disabled,
  type,
}: AppButtonProps): JSX.Element => {
  const btnColor = color || AppColors.PRIMARY;
  return (
    <Button
      bg={
        disabled ? AppColors.AAA : type === "outline" ? "white" : AppColors.TEAL
      }
      borderColor={type === "outline" ? AppColors.TEAL : "white"}
      borderWidth={1}
      borderRadius={10}
      width={"100%"}
      height={50}
      onPress={onPress}
      _text={{
        color: type === "outline" ? AppColors.TEAL : "white",
        fontSize: 16,
      }}
      _pressed={{
        backgroundColor: type === "outline" ? "white" : `${AppColors.TEAL}E6`,
      }}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};

export default AppButton;
