import { Button, Toast } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { PLUS_ICON } from "../../commons/assets";
import { useAppSelector } from "../../hooks/useAppSelector";
import { navigate } from "../../navigations/rootNavigation";
import { isAddressExists } from "../../services/address-validation";
import { selectCustomer } from "../../slices/customer-slice";

type FloatingButtonProps = {};

const FloatingButton = ({}: FloatingButtonProps): JSX.Element => {
  const { addressExists } = isAddressExists();

  const sayWarning = () => {
    Toast.show({
      title: "Profile information Missing",
      description: "Please update address & property details",
      variant: "solid",
    });
  };
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
        onPress={() => {
          if (!addressExists) {
            sayWarning();
          }
          if (!addressExists) {
            sayWarning();
          } else {
            navigate("ChooseService");
          }
        }}
      >
        <SvgCss xml={PLUS_ICON()} />
      </Button>
    </>
  );
};

export default FloatingButton;
