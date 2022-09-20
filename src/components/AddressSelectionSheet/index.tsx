import {
  Actionsheet,
  Center,
  Divider,
  ScrollView,
  Spacer,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { navigate } from "../../navigations/rootNavigation";
import { StorageHelper } from "../../services/storage-helper";
import {
  getCustomerByIdAsync,
  selectAddress,
  selectCustomer,
  updateAddressAsync,
} from "../../slices/customer-slice";
import { resetLeadState } from "../../slices/lead-slice";
import AddressListItem from "../AddressListItem";

type AddressSelectionSheetProps = {
  showSelection: boolean;
  setShowSelection: Function;
};

const AddressSelectionSheet = ({
  showSelection,
  setShowSelection,
}: AddressSelectionSheetProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);

  const { uiState: addressUiState } = useAppSelector(selectAddress);
  return (
    <Actionsheet
      isOpen={showSelection}
      onClose={() => setShowSelection(false)}
      hideDragIndicator={true}
    >
      <Actionsheet.Content
        style={{
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          margin: 0,
          backgroundColor: AppColors.WHITE,
        }}
      >
        <VStack pt={15} bg={"white"} width="100%">
          <Center>
            <Text fontSize={18} fontWeight="semibold">
              Choose Address
            </Text>
          </Center>
          <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} />
          <ScrollView width={"100%"}>
            <VStack px={4} py={4} space={0} pb={75} bg={AppColors.WHITE}>
              {customerUiState === "IN_PROGRESS" ||
              addressUiState === "IN_PROGRESS" ? (
                <>
                  <Spinner size={"sm"} />
                </>
              ) : (
                <VStack
                  divider={
                    <Divider
                      thickness={0.8}
                      mt={2}
                      mb={2}
                      borderStyle={"dashed"}
                      bg={AppColors.CCC}
                    />
                  }
                >
                  {customer?.addresses?.map((addressItem, index) => (
                    <AddressListItem
                      key={index}
                      showChoose={true}
                      onChoose={async (address) => {
                        let payload: any = {
                          ...address,
                          isPrimary: true,
                          serviceAccountId: customer.sAccountId,
                        };
                        await StorageHelper.removeValue("LEAD_ID");
                        await dispatch(updateAddressAsync(payload));
                        await dispatch(
                          getCustomerByIdAsync(customer.customerId)
                        );
                        setShowSelection(false);
                        navigate("ChooseService");
                        setTimeout(() => {
                          dispatch(resetLeadState());
                        }, 500);
                      }}
                      address={addressItem}
                      position={index + 1}
                    />
                  ))}
                </VStack>
              )}
            </VStack>
          </ScrollView>
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default AddressSelectionSheet;
