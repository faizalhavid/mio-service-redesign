import React from "react";
import { AppColors } from "../../commons/colors";
import { TextField } from "rn-material-ui-textfield";
import { KeyboardTypeOptions } from "react-native";
import { Text } from "native-base";

type AppInputProps = {
  type: "text" | "number" | "email" | "password";
  label: string;
  value?: string;
  disabled?: boolean;
  expiry?: boolean;
  suffix?: React.ReactNode;
  onChange?: (...event: any[]) => void;
};

const AppInput = ({
  type,
  label,
  value,
  disabled,
  expiry,
  suffix,
  onChange,
}: AppInputProps): JSX.Element => {
  const keyboardType: { [key: string]: KeyboardTypeOptions } = {
    text: "default",
    number: "numeric",
    email: "email-address",
  };

  const formatText = (text: string) => {
    if (text && text.length >= 2) {
      let inputText = text.replace(/\//gi, "");
      return `${inputText.substring(0, 2)}/${inputText.substring(2)}`;
    }
    return text;
  };

  const [focussed, setFocussed] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <>
      <TextField
        label={label}
        formatText={expiry ? formatText : undefined}
        labelFontSize={14}
        keyboardType={keyboardType[type]}
        inputContainerStyle={{
          borderBottomWidth: focussed ? 0 : 1,
          borderColor: "#ccc",
        }}
        disabled={disabled}
        returnKeyType="done"
        onFocus={() => setFocussed(true)}
        onBlur={() => setFocussed(false)}
        fontSize={14}
        lineWidth={focussed ? 1 : 0}
        disabledLineWidth={0}
        secureTextEntry={type === "password"}
        renderRightAccessory={() => {
          switch (type) {
            case "password":
              return <></>;
              break;
            case "text":
              return <>{suffix || <></>}</>;
              break;
            default:
              return <></>;
          }
        }}
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
