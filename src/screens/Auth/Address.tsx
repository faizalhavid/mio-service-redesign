import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Center, CheckIcon, Divider, Select, Text, VStack } from "native-base";
import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { AppColors } from "../../commons/colors";
import { STATES } from "../../commons/dropdown-values";
import { HouseInfoAddressRequest } from "../../commons/types";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { SuperRootStackParamList } from "../../navigations";
import { goBack, popToPop } from "../../navigations/rootNavigation";
import ErrorView from "../../components/ErrorView";
import { FLAG_TYPE, STATUS } from "../../commons/status";
import { StorageHelper } from "../../services/storage-helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  getCustomerByIdAsync,
  getHouseInfoAsync,
  putCustomerAsync,
  selectCustomer,
  selectHouseInfo,
} from "../../slices/customer-slice";
import { useAppSelector } from "../../hooks/useAppSelector";
import { FAILED, IN_PROGRESS } from "../../commons/ui-states";

type AddressProps = NativeStackScreenProps<SuperRootStackParamList, "Address">;
const Address = ({ route }: AddressProps): JSX.Element => {
  const { returnTo } = route.params;
  const dispatch = useAppDispatch();
  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);
  const {
    uiState: houseInfoUiState,
    member: houseInfo,
    error: houseInfoError,
  } = useAppSelector(selectHouseInfo);
  const fetchCustomerProfile = useCallback(async () => {
    let cId = await StorageHelper.getValue("CUSTOMER_ID");
    await dispatch(getCustomerByIdAsync(cId));
    if (returnTo === "ServiceDetails" || customer?.addresses[0]) {
      setValue("street", customer.addresses[0].street);
      setValue("city", customer.addresses[0].city);
      setValue("state", customer.addresses[0].state);
      setValue("zip", customer.addresses[0].zip);
    }
  }, []);

  useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<HouseInfoAddressRequest>({
    mode: "onChange",
  });

  const onSubmit = async (data: HouseInfoAddressRequest) => {
    await dispatch(
      getHouseInfoAsync({
        nva: data.street,
        addresses: [
          {
            ...data,
          },
        ],
      })
    );
    await dispatch(
      putCustomerAsync({
        ...customer,
        addresses: [
          {
            ...customer.addresses[0],
            houseInfo: {
              ...houseInfo,
            },
          },
        ],
      })
    );
    await StorageHelper.setValue(
      FLAG_TYPE.ADDRESS_DETAILS_STATUS,
      STATUS.COMPLETED
    );
    if (returnTo) {
      goBack();
    } else {
      let status = await StorageHelper.getValue(
        FLAG_TYPE.EMAIL_VERIFICATION_STATUS
      );
      if (status === STATUS.PENDING) {
        popToPop("VerifyEmail");
      } else {
        await StorageHelper.setValue(
          FLAG_TYPE.ALL_INITIAL_SETUP_COMPLETED,
          STATUS.COMPLETED
        );
        popToPop("Dashboard");
      }
    }
  };

  return (
    <AppSafeAreaView
      loading={
        customerUiState === IN_PROGRESS || houseInfoUiState === IN_PROGRESS
      }
    >
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <VStack paddingX={5} mt={10}>
          <Center width={"100%"}>
            <Text fontSize={20}>Update Address</Text>
          </Center>
          <VStack mt={10} space={0}>
            {(customerUiState === FAILED || houseInfoUiState === FAILED) && (
              <ErrorView
                message={
                  "Something went wrong while creating profile. Please try again."
                }
              />
            )}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="text"
                  label="Street"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="street"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="text"
                  label="City"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="city"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  {value ? (
                    <Text mt={2} color={"gray.400"} fontSize={14}>
                      State
                    </Text>
                  ) : (
                    <Divider thickness={0} mt={2} />
                  )}
                  <Select
                    accessibilityLabel="STATE"
                    placeholder="State"
                    borderBottomWidth={1}
                    borderBottomColor={"#ccc"}
                    _selectedItem={{
                      bg: AppColors.PRIMARY,
                      endIcon: <CheckIcon size="5" />,
                    }}
                    pl={-10}
                    mt={value ? -3 : 4}
                    fontSize={14}
                    variant="underlined"
                    onValueChange={onChange}
                    selectedValue={value}
                  >
                    {STATES.map((state) => {
                      return (
                        <Select.Item
                          pl={0}
                          key={state.code}
                          label={state.name}
                          value={state.code}
                        />
                      );
                    })}
                  </Select>
                </>
              )}
              name="state"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="number"
                  label="Zipcode"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="zip"
            />
          </VStack>
        </VStack>
      </KeyboardAwareScrollView>
      <FooterButton
        disabled={!isValid && isDirty}
        label={"SAVE ADDRESS"}
        onPress={handleSubmit(onSubmit)}
      />
    </AppSafeAreaView>
  );
};

export default Address;
