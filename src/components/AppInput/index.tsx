import React from "react";
import { AppColors } from "../../commons/colors";
import { TextField } from "rn-material-ui-textfield";
import { KeyboardTypeOptions } from "react-native";
import { Pressable, Text } from "native-base";
import { SvgCss } from "react-native-svg";
import {
  EYE_ICON,
  FILLED_CIRCLE_TICK_ICON,
  SLASHED_EYE_ICON,
} from "../../commons/assets";

type AppInputProps = {
  type: "text" | "number" | "email" | "password";
  label: string;
  value?: string;
  disabled?: boolean;
  expiry?: boolean;
  suffix?: React.ReactNode;
  error?: string | undefined;
  onChange?: (...event: any[]) => void;
};

const AppInput = ({
  type,
  label,
  value,
  disabled,
  expiry,
  suffix,
  error,
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
        autoCapitalize="none"
        disabled={disabled}
        returnKeyType="done"
        onFocus={() => setFocussed(true)}
        onBlur={() => setFocussed(false)}
        fontSize={14}
        lineWidth={focussed ? 1 : 0}
        disabledLineWidth={0}
        secureTextEntry={type === "password" && (showPassword ? false : true)}
        renderRightAccessory={() => {
          switch (type) {
            case "password":
              return (
                <Pressable
                  pr={2}
                  pb={1}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <SvgCss
                      width={18}
                      height={18}
                      xml={SLASHED_EYE_ICON("#aaa")}
                    />
                  ) : (
                    <SvgCss width={18} height={18} xml={EYE_ICON("#aaa")} />
                  )}
                </Pressable>
              );
              break;
            case "text":
              return <>{suffix || <></>}</>;
              break;
            default:
              return <></>;
          }
        }}
        // baseColor={AppColors.SECONDARY}
        selectionColor={AppColors.CCC}
        tintColor={AppColors.SECONDARY}
        textColor={AppColors.SECONDARY}
        value={value}
        onChangeText={onChange}
      />
      {error !== undefined && error.length > 0 && (
        <Text fontSize={"14"} color="red.500" fontWeight={"semibold"}>
          {error}
        </Text>
      )}
    </>
  );
};

export default AppInput;
