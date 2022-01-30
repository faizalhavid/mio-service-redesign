import { Input, View } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import { TextField } from "rn-material-ui-textfield";
import { KeyboardTypeOptions } from "react-native";

type AppInputProps = {
  type: "text" | "number" | "email" | "password";
  label: string;
  lineWidth?: number;
};

const AppInput = ({ type, label, lineWidth }: AppInputProps): JSX.Element => {
  const keyboardType: { [key: string]: KeyboardTypeOptions } = {
    text: "default",
    number: "numeric",
    email: "email-address",
  };
  return (
    <>
      <TextField
        label={label}
        labelFontSize={14}
        keyboardType={keyboardType[type]}
        // returnKeyType={"go"}
        fontSize={14}
        lineWidth={lineWidth || 0.7}
        // characterRestriction={10}
        secureTextEntry={type === "password"}
        // baseColor={AppColors.SECONDARY}
        tintColor={AppColors.SECONDARY}
        textColor={AppColors.SECONDARY}
      />
    </>
  );
};

export default AppInput;
