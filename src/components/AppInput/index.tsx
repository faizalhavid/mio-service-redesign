import { Input, Text, View } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import { TextField } from "rn-material-ui-textfield";
import { KeyboardTypeOptions } from "react-native";

type AppInputProps = {
  type: "text" | "number" | "email" | "password";
  label: string;
  value?: string;
  disabled?: boolean;
  onChange?: (...event: any[]) => void;
};

const AppInput = ({
  type,
  label,
  value,
  disabled,
  onChange,
}: AppInputProps): JSX.Element => {
  const keyboardType: { [key: string]: KeyboardTypeOptions } = {
    text: "default",
    number: "numeric",
    email: "email-address",
  };
  const [focussed, setFocussed] = React.useState(false);
  return (
    <>
      <TextField
        label={label}
        labelFontSize={14}
        keyboardType={keyboardType[type]}
        inputContainerStyle={{
          borderBottomWidth: focussed ? 0 : 1,
          borderColor: "#ccc",
        }}
        disabled={disabled}
        onFocus={() => setFocussed(true)}
        onBlur={() => setFocussed(false)}
        fontSize={14}
        lineWidth={focussed ? 1 : 0}
        disabledLineWidth={0}
        secureTextEntry={type === "password"}
        renderRightAccessory={() => (type === "password" ? <></> : <></>)}
        // baseColor={AppColors.SECONDARY}
        tintColor={AppColors.SECONDARY}
        textColor={AppColors.SECONDARY}
        value={value}
        onChangeText={onChange}
      />
    </>
  );
};

export default AppInput;
