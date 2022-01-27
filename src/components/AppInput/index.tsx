import { Input } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";

type AppInputProps = {
  type: "text" | "number";
  label: string;
};

const AppInput = ({ type, label }: AppInputProps): JSX.Element => {
  return (
    <>
      <Input
        _focus={{
          borderBottomColor: AppColors.SECONDARY,
        }}
        returnKeyType="next"
        clearButtonMode="always"
        autoCapitalize="none"
        placeholder={label}
        variant={"underlined"}
        autoCorrect={false}
      />
    </>
  );
};

export default AppInput;
