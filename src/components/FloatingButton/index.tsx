import { Button, Toast } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { PLUS_ICON } from "../../commons/assets";
import { useAppSelector } from "../../hooks/useAppSelector";
import { navigate } from "../../navigations/rootNavigation";
import { selectCustomer } from "../../slices/customer-slice";

type FloatingButtonProps = {};

const FloatingButton = ({}: FloatingButtonProps): JSX.Element => {
  const { uiState: customerUiState, member: customer } =
    useAppSelector(selectCustomer);

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
          if (
            !customer ||
            !customer?.addresses ||
            customer?.addresses.length === 0 ||
            (customer?.addresses.length > 0 &&
              (!Boolean(customer?.addresses[0].street) ||
                !Boolean(customer?.addresses[0].zip)))
          ) {
            sayWarning();
          }
          if (
            !customer ||
            !customer?.addresses ||
            customer?.addresses.length === 0 ||
            (customer?.addresses.length > 0 &&
              (!Boolean(customer?.addresses[0]?.houseInfo?.lotSize) ||
                !Boolean(customer?.addresses[0]?.houseInfo?.bedrooms) ||
                !Boolean(customer?.addresses[0]?.houseInfo?.bathrooms) ||
                !Boolean(customer?.addresses[0]?.houseInfo?.swimmingPoolType) ||
                !Boolean(customer?.addresses[0]?.houseInfo?.pestType)))
          ) {
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
