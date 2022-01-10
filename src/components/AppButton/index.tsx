import { Button, useContrastText } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type AppButtonProps = {
  onPress: () => void;
  label: string;
};

const AppButton = ({ label, onPress }: AppButtonProps): JSX.Element => {
  return (
    <>
      <Button
        bg={AppColors.PRIMARY}
        borderColor={AppColors.PRIMARY}
        borderRadius={50}
        width={250}
        height={60}
        onPress={onPress}
        _text={{
          color: useContrastText(AppColors.PRIMARY),
        }}
        _pressed={{
          backgroundColor: `${AppColors.PRIMARY}E6`,
        }}
      >
        {label}
      </Button>
    </>
  );
};

export default AppButton;
