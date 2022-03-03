import { Button, useContrastText } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type AppButtonProps = {
  onPress: (param?: any) => void;
  color?: string;
  label: string;
  disabled?: boolean;
};

const AppButton = ({
  label,
  color,
  onPress,
  disabled,
}: AppButtonProps): JSX.Element => {
  const btnColor = color || AppColors.PRIMARY;
  return (
    <>
      <Button
        bg={btnColor}
        borderColor={btnColor}
        borderRadius={50}
        width={250}
        height={60}
        onPress={onPress}
        _text={{
          color: useContrastText(btnColor),
        }}
        _pressed={{
          backgroundColor: `${btnColor}E6`,
        }}
        disabled={disabled}
      >
        {label}
      </Button>
    </>
  );
};

export default AppButton;
