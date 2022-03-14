import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Center, CheckIcon, Divider, Select, Text, VStack } from "native-base";
import React, { useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { AppColors } from "../../commons/colors";
import { STATES } from "../../commons/dropdown-values";
import {
  FormattedAddress,
  HouseInfoAddressRequest,
  HouseInfoRequest,
} from "../../commons/types";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { SuperRootStackParamList } from "../../navigations";
import { goBack, popToPop } from "../../navigations/rootNavigation";
import {
  getCustomer,
  getHouseInfo,
  putCustomer,
} from "../../services/customer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomerProfile, useAuth } from "../../contexts/AuthContext";
import ErrorView from "../../components/ErrorView";
import { FLAG_TYPE, STATUS } from "../../commons/status";
import { StorageHelper } from "../../services/storage-helper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type AddressProps = NativeStackScreenProps<SuperRootStackParamList, "Address">;
const Address = ({ route }: AddressProps): JSX.Element => {
  const { returnTo } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const { customerProfile, setCustomerProfile } = useAuth();
  const [customerId, setCustomerId] = React.useState<string | null>(null);

  const fetchCustomerProfile = useCallback(async () => {
    let cId = await StorageHelper.getValue("CUSTOMER_ID");
    setCustomerId(cId);
    await getCustomerMutation.mutateAsync();
  }, []);

  useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

  const getCustomerMutation = useMutation(
    "getCustomer",
    () => {
      setLoading(true);
      return getCustomer(customerId);
    },
    {
      onSuccess: (data) => {
        setCustomerProfile(data.data);
        if (returnTo === "ServiceDetails" || data.data?.addresses[0]) {
          setValue("street", data.data.addresses[0].street);
          setValue("city", data.data.addresses[0].city);
          setValue("state", data.data.addresses[0].state);
          setValue("zip", data.data.addresses[0].zip);
        }
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const getHouseInfoMutation = useMutation(
    "getHouseInfo",
    (data: HouseInfoRequest): any => {
      setLoading(true);
      return getHouseInfo(data);
    },
    {
      onSuccess: (response: any) => {
        setLoading(false);
        putAddressMutation.mutate({
          ...customerProfile,
          addresses: [
            {
              ...response.data,
            },
          ],
        });
      },
      onError: (err: any) => {
        setLoading(false);
        setErrorMsg(
          "Something went wrong while updating address. Please try again."
        );
        console.log(err);
      },
    }
  );

  const putAddressMutation = useMutation(
    "putAddressMutation",
    (data: CustomerProfile): any => {
      setLoading(true);
      return putCustomer(data);
    },
    {
      onSuccess: async (data: FormattedAddress) => {
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
      },
      onError: (err: any) => {
        setLoading(false);
        setErrorMsg(
          "Something went wrong while creating profile. Please try again."
        );
        console.log(err);
      },
    }
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<HouseInfoAddressRequest>({
    mode: "onChange",
  });

  const onSubmit = async (data: HouseInfoAddressRequest) => {
    setLoading(true);
    setErrorMsg("");

    getHouseInfoMutation.mutate({
      nva: data.street,
      addresses: [
        {
          ...data,
        },
      ],
    });
  };

  return (
    <AppSafeAreaView loading={loading}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <VStack paddingX={5} mt={10}>
          <Center width={"100%"}>
            <Text fontSize={20}>Update Address</Text>
          </Center>
          <VStack mt={10} space={0}>
            <ErrorView message={errorMsg} />
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
                    mt={value ? -3 : 2}
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
