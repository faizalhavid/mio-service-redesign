import { Button } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { PLUS_ICON } from "../../commons/assets";

type FloatingButtonProps = {
  onPress: () => void;
};

const FloatingButton = ({ onPress }: FloatingButtonProps): JSX.Element => {
  return (
    <>
      <Button
        position={"absolute"}
        bottom={5}
        right={5}
        borderRadius={100}
        width={60}
        height={60}
        shadow={3}
        bg={"amber.400"}
        onPress={onPress}
      >
        <SvgCss xml={PLUS_ICON()} />
      </Button>
    </>
  );
};

export default FloatingButton;
