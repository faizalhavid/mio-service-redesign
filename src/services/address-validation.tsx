import { useState, useEffect } from "react";
import { AddressMode } from "../components/AddressBottomSheet";
import { useAppSelector } from "../hooks/useAppSelector";
import { selectCustomer } from "../slices/customer-slice";

export function isAddressExists() {
  const [addressExists, setAddressExists] = useState<boolean>(true);
  const [addressMode, setAddressMode] = useState<AddressMode>("UPDATE_ADDRESS");
  const { member: customer, uiState: customerUiState } =
    useAppSelector(selectCustomer);

  useEffect(() => {
    if (
      !customer ||
      (customer && !customer?.addresses) ||
      customer?.addresses?.length === 0 ||
      (customer?.addresses?.length > 0 &&
        (!Boolean(customer?.addresses[0].street) ||
          !Boolean(customer?.addresses[0].zip)))
    ) {
      setAddressMode("UPDATE_ADDRESS");
      setAddressExists(false);
    } else if (
      !customer ||
      !customer?.addresses ||
      customer?.addresses?.length === 0 ||
      (customer?.addresses?.length > 0 &&
        (!Boolean(customer?.addresses?.[0]?.houseInfo?.lotSize) ||
          !Boolean(customer?.addresses?.[0]?.houseInfo?.bedrooms) ||
          !Boolean(customer?.addresses?.[0]?.houseInfo?.bathrooms)))
    ) {
      setAddressMode("UPDATE_PROPERTY");
      setAddressExists(false);
    } else {
      setAddressExists(true);
    }
  }, [customerUiState, customer]);

  return { addressExists, addressMode };
}
