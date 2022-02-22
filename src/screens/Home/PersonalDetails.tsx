import {
  Button,
  Center,
  CheckIcon,
  Divider,
  KeyboardAvoidingView,
  ScrollView,
  Select,
  Text,
  VStack,
} from "native-base";
import React, { useCallback, useEffect } from "react";
import { useMutation } from "react-query";
import { AppColors } from "../../commons/colors";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { CustomerProfile, Phone } from "../../contexts/AuthContext";
import { goBack, navigate } from "../../navigations/rootNavigation";
import {
  getCustomer,
  getHouseInfo,
  putCustomer,
} from "../../services/customer";
import { FormattedAddress, HouseInfoRequest } from "../../commons/types";
import { Controller, useForm } from "react-hook-form";
import { STATES } from "../../commons/dropdown-values";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

type PersonalDetailsForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  street: string;
  zip: string;
};

const PersonalDetails = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [customerProfile, setCustomerProfile] = React.useState<CustomerProfile>(
    {} as CustomerProfile
  );
  const [customerId, setCustomerId] = React.useState<string | null>(null);
  const [errorMsg, setErrorMsg] = React.useState("");
  const getCustomerMutation = useMutation(
    "getCustomer",
    () => {
      setLoading(true);
      return getCustomer(customerId);
    },
    {
      onSuccess: (data) => {
        setCustomerProfile(data.data);
        setValue("firstName", data.data.firstName);
        setValue("lastName", data.data.lastName);
        setValue("phone", data.data.phones[0].number);
        setValue("email", data.data.email);
        setValue("street", data.data.addresses[0].street);
        setValue("city", data.data.addresses[0].city);
        setValue("state", data.data.addresses[0].state);
        setValue("zip", data.data.addresses[0].zip);
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const fetchCustomerProfile = useCallback(async () => {
    await getCustomerMutation.mutateAsync();
  }, []);

  useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

  const getHouseInfoMutation = useMutation(
    "getHouseInfo",
    (data: HouseInfoRequest): any => {
      setLoading(true);
      return getHouseInfo(data);
    },
    {
      onSuccess: (response: any) => {
        setLoading(false);
        let formValues = getValues();
        putAddressMutation.mutate({
          ...customerProfile,
          addresses: [
            {
              ...response.data,
            },
          ],
          ...{
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            phones: [
              {
                ...({} as Phone),
                number: formValues.phone,
              },
            ],
          },
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
        setLoading(false);
        goBack();
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
    getValues,
    formState: { errors, isDirty, isValid },
  } = useForm<PersonalDetailsForm>({
    mode: "onChange",
  });

  const onSubmit = async (data: PersonalDetailsForm) => {
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

  const Header = (text: string) => {
    return (
      <Center>
        <Divider thickness={1} width={"90%"} bgColor={AppColors.SECONDARY} />
        <Button
          mt={-4}
          p={1}
          bg={"#fff"}
          borderColor={AppColors.SECONDARY}
          _text={{
            color: AppColors.SECONDARY,
            fontSize: 12,
          }}
          width={"40%"}
          variant={"outline"}
          borderRadius={20}
        >
          {text}
        </Button>
      </Center>
    );
  };
  return (
    <AppSafeAreaView loading={loading}>
      {/* <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}> */}
      <KeyboardAwareScrollView enableOnAndroid={true}>
        {/* <ScrollView> */}
        <VStack>
          <Center>
            <Text fontSize={20} pt={5}>
              Personal Details
            </Text>
          </Center>
          <Divider thickness={0} mt={10} />
          {Header("Current Information")}
          <Center>
            <Divider thickness={0} mt={5} />
            <Text fontWeight={"semibold"}>
              {customerProfile.firstName} {customerProfile.lastName}
            </Text>
            {customerProfile.addresses && customerProfile.addresses.length > 0 && (
              <>
                <Text>{customerProfile.addresses[0].street}</Text>
                <Text>
                  {customerProfile.addresses[0].state},{" "}
                  {customerProfile.addresses[0].city}{" "}
                  {customerProfile.addresses[0].zip}
                </Text>
                <Text>{customerProfile.phones[0].number}</Text>
                <Text>{customerProfile.customerId}</Text>
              </>
            )}
          </Center>
          <Divider thickness={0} mt={10} />
          {Header("Update")}
          {/* <Divider thickness={0} mt={10} /> */}
          <VStack px={5}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="text"
                  label="Firstname"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="firstName"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="text"
                  label="Lastname"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="lastName"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="number"
                  label="Phone"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="phone"
            />

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
                    borderBottomWidth={1}
                    borderBottomColor={"#ccc"}
                    _selectedItem={{
                      bg: AppColors.PRIMARY,
                      endIcon: <CheckIcon size="5" />,
                    }}
                    pl={-10}
                    pb={1}
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
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="email"
                  label="Email"
                  onChange={onChange}
                  disabled={true}
                  value={value}
                />
              )}
              name="email"
            />
          </VStack>
        </VStack>
        <Divider thickness={0} mt={220}></Divider>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
      {/* </KeyboardAvoidingView> */}
      <FooterButton
        label={"UPDATE"}
        disabled={!isValid && isDirty}
        subText={
          !isValid && isDirty ? "Please provide all required fields" : ""
        }
        onPress={handleSubmit(onSubmit)}
      />
    </AppSafeAreaView>
  );
};

export default PersonalDetails;
