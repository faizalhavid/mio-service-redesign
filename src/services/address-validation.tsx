import { useEffect, useState } from 'react';
import { useAppSelector } from '../hooks/useAppSelector';
import { selectCustomer } from '../slices/customer-slice';

export function isAddressExists() {
  const [addressExists, setAddressExists] = useState<boolean>(true);
  const { member: customer, uiState: customerUiState } = useAppSelector(selectCustomer);

  useEffect(() => {
    if (
      !customer?.addresses?.[0]?.state ||
      !customer?.addresses?.[0]?.zip ||
      !customer?.addresses?.[0]?.houseInfo?.lotSize ||
      !customer?.addresses?.[0]?.houseInfo?.bedrooms ||
      !customer?.addresses?.[0]?.houseInfo?.bathrooms
    ) {
      setAddressExists(false);
    } else {
      setAddressExists(true);
    }
  }, [customerUiState, customer]);

  return { addressExists };
}
