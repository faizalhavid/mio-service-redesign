import { Button } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { PLUS_ICON } from "../../commons/assets";
import { navigate } from "../../navigations/rootNavigation";
import { isAddressExists } from "../../services/address-validation";

type FloatingButtonProps = {};

function FloatingButton({}: FloatingButtonProps): JSX.Element {
  const { addressExists } = isAddressExists();

  return (
    <Button
        position="absolute"
        bottom={5}
        right={5}
        borderRadius={100}
        width={60}
        height={60}
        shadow={3}
        bg="amber.400"
        onPress={() => {
          if (!addressExists) {
            navigate("EditAddress", {
              returnTo: "ChooseService",
              mode: "NEW_ADDRESS",
            });
          } else {
            navigate("ChooseService");
          }
        }}
      >
        <SvgCss xml={PLUS_ICON()} />
      </Button>
  );
}

export default FloatingButton;
