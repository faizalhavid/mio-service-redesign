import {
  Button,
  Center,
  CheckIcon,
  Divider,
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
import { CustomerProfile, Phone, useAuth } from "../../contexts/AuthContext";
import { goBack } from "../../navigations/rootNavigation";
import {
  getCustomer,
  getHouseInfo,
  putCustomer,
} from "../../services/customer";
import { FormattedAddress, HouseInfoRequest } from "../../commons/types";
import { Controller, useForm } from "react-hook-form";
import { STATES } from "../../commons/dropdown-values";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ErrorView from "../../components/ErrorView";

type PersonalDetailsForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  street: string;
  zip: string;
  lotSize: string;
  bedrooms: string;
  bathrooms: string;
};

const PersonalDetails = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const { customerProfile, setCustomerProfile } = useAuth();
  const [errorMsg, setErrorMsg] = React.useState("");

  const fetchCustomerProfile = useCallback(async () => {
    await getCustomerMutation.mutateAsync();
  }, []);

  useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

  const getCustomerMutation = useMutation(
    "getCustomer",
    () => {
      setLoading(true);
      return getCustomer(customerProfile.customerId);
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
        setValue(
          "lotSize",
          String(data.data.addresses[0].houseInfo?.lotSize || "")
        );
        setValue(
          "bedrooms",
          String(data.data.addresses[0].houseInfo?.bedrooms || "")
        );
        setValue(
          "bathrooms",
          String(data.data.addresses[0].houseInfo?.bathrooms || "")
        );
        setLoading(false);
      },
      onError: () => {
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
        let formValues = getValues();
        putAddressMutation.mutate({
          ...customerProfile,
          addresses: [
            {
              ...response.data,
              houseInfo: {
                lotSize: parseInt(formValues.lotSize),
                bedrooms: parseInt(formValues.bedrooms),
                bathrooms: parseInt(formValues.bathrooms),
              },
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
      onSuccess: async () => {
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
    formState: { errors, isValid },
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
          _pressed={{
            backgroundColor: "#fff",
          }}
          width={"50%"}
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
          {Header("Update Personal Information")}
          {/* <Divider thickness={0} mt={10} /> */}
          <VStack px={5}>
            <ErrorView message={errorMsg} />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
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
        <Divider thickness={0} mt={10} />
        {Header("Update Property Details")}
        <VStack px={5}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                type="number"
                label="Lawn Size (Sq. Ft)"
                onChange={onChange}
                value={value}
              />
            )}
            name="lotSize"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                type="number"
                label="Number of Bedrooms"
                onChange={onChange}
                value={value}
              />
            )}
            name="bedrooms"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                type="number"
                label="Number of Bathrooms"
                onChange={onChange}
                value={value}
              />
            )}
            name="bathrooms"
          />
          <Divider thickness={0} mt={220} />
        </VStack>

        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
      {/* </KeyboardAvoidingView> */}
      <FooterButton
        disabled={!isValid}
        label={"UPDATE"}
        onPress={(event) => {
          setErrorMsg("");
          if (!isValid) {
            if (Object.keys(errors).length === 0) {
              setErrorMsg("No fields are changed");
            } else {
              setErrorMsg("Make sure all fields are filled");
            }
            return;
          }
          handleSubmit(onSubmit)(event).catch((error) => {
            setErrorMsg(error);
          });
        }}
      />
    </AppSafeAreaView>
  );
};

export default PersonalDetails;
