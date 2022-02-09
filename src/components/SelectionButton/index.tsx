import { Button, Text } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type SelectionButtonProps = {
  w?: number;
  h?: number;
  variant?: "simple" | "custom";
  active: boolean | undefined;
  onPress: (index: number) => void;
  text?: string;
  index: number;
  text2?: (textColor: string) => React.ReactNode;
};

const SelectionButton = ({
  w,
  h,
  active,
  index,
  text,
  onPress,
  text2,
  variant = "simple",
}: SelectionButtonProps): JSX.Element => {
  const textColor = active ? "white" : AppColors.SECONDARY;
  return (
    <>
      <Button
        variant={active ? "solid" : "outline"}
        width={w}
        height={h}
        _pressed={{
          backgroundColor: AppColors.DARK_PRIMARY,
        }}
        bg={active ? AppColors.SECONDARY : "#fff"}
        borderColor={AppColors.SECONDARY}
        onPress={() => onPress(index)}
      >
        {variant === "simple" && (
          <Text textAlign={"center"} color={textColor}>
            {text}
          </Text>
        )}
        {variant === "custom" && text2 && text2(textColor)}
      </Button>
    </>
  );
};

export default SelectionButton;
