import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Center,
  CheckIcon,
  Flex,
  Input,
  Select,
  Spacer,
  Text,
  VStack,
} from "native-base";
import React, { useCallback, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { AppColors } from "../../commons/colors";
import { STATES } from "../../commons/dropdown-values";
import {
  FormattedAddress,
  HouseInfoAddressRequest,
  HouseInfoRequest,
} from "../../commons/types";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { SuperRootStackParamList } from "../../navigations";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import {
  getCustomer,
  getHouseInfo,
  putCustomer,
} from "../../services/customer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomerProfile } from "../../contexts/AuthContext";

type AddressProps = NativeStackScreenProps<SuperRootStackParamList, "Address">;
const Address = ({ route }: AddressProps): JSX.Element => {
  const { returnTo } = route.params;
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [customerProfile, setCustomerProfile] = React.useState<CustomerProfile>(
    {} as CustomerProfile
  );
  const [customerId, setCustomerId] = React.useState<string | null>(null);

  const fetchCustomerProfile = useCallback(async () => {
    let cId = await AsyncStorage.getItem("CUSTOMER_ID");
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
          "Something went wrong while creating profile. Please try again."
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
        await AsyncStorage.setItem(
          "APP_START_STATUS",
          "EMAIL_VERIFICATION_PENDING"
        );
        setLoading(false);
        popToPop("VerifyEmail");
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
    formState: { errors, isDirty, isValid },
  } = useForm<HouseInfoAddressRequest>({
    defaultValues: {
      city: "Edison",
      state: "NJ",
      street: "21 Keen Ln",
      zip: "08820",
    },
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
      <VStack paddingX={5} mt={10}>
        <Center width={"100%"}>
          <Text fontSize={20}>Update Address</Text>
        </Center>
        <VStack mt={10} space={0}>
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
                  <Text color={"gray.400"} fontSize={14}>
                    State
                  </Text>
                ) : (
                  <></>
                )}
                <Select
                  accessibilityLabel="STATE"
                  placeholder="State"
                  borderBottomWidth={1.5}
                  borderBottomColor={"#bbb"}
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
                type="text"
                label="Zipcode"
                onChange={onChange}
                value={value}
              />
            )}
            name="zip"
          />
        </VStack>
      </VStack>
      <FooterButton
        label={"SAVE ADDRESS"}
        subText="Choose Service in next step"
        onPress={handleSubmit(onSubmit)}
      />
    </AppSafeAreaView>
  );
};

export default Address;
