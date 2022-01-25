import { Button, Text } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type SelectionButtonProps = {
  w?: number;
  h?: number;
  variant?: "simple" | "custom";
  active: boolean;
  text?: string;
  text2?: (textColor: string) => React.ReactNode;
};

const SelectionButton = ({
  w,
  h,
  active,
  text,
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
        bg={active ? AppColors.SECONDARY : "#fff"}
        borderColor={AppColors.SECONDARY}
      >
        {variant === "simple" && <Text color={textColor}>{text}</Text>}
        {variant === "custom" && text2 && text2(textColor)}
      </Button>
    </>
  );
};

export default SelectionButton;
