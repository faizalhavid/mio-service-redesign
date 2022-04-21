import {
  Button,
  Center,
  CheckIcon,
  Divider,
  Select,
  Text,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { AppColors } from "../../commons/colors";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { Phone } from "../../contexts/AuthContext";
import { goBack } from "../../navigations/rootNavigation";
import { Controller, useForm } from "react-hook-form";
import { STATES } from "../../commons/dropdown-values";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ErrorView from "../../components/ErrorView";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  getHouseInfoAsync,
  putCustomerAsync,
  selectCustomer,
  selectHouseInfo,
} from "../../slices/customer-slice";
import { IN_PROGRESS } from "../../commons/ui-states";

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
  const [errorMsg, setErrorMsg] = React.useState("");

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

  useEffect(() => {
    if (customer) {
      setValue("firstName", customer.firstName);
      setValue("lastName", customer.lastName);
      setValue("phone", customer.phones[0].number);
      setValue("email", customer.email);
      setValue("street", customer.addresses[0].street);
      setValue("city", customer.addresses[0].city);
      setValue("state", customer.addresses[0].state);
      setValue("zip", customer.addresses[0].zip);
      setValue(
        "lotSize",
        String(customer.addresses[0].houseInfo?.lotSize || "")
      );
      setValue(
        "bedrooms",
        String(customer.addresses[0].houseInfo?.bedrooms || "")
      );
      setValue(
        "bathrooms",
        String(customer.addresses[0].houseInfo?.bathrooms || "")
      );
    }
  }, [customer]);

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
    dispatch(
      getHouseInfoAsync({
        nva: data.street,
        addresses: [
          {
            ...data,
          },
        ],
      })
    ).then(() => {
      let formValues = getValues();
      dispatch(
        putCustomerAsync({
          ...customer,
          addresses: [
            {
              ...customer.addresses[0],
              houseInfo: {
                ...houseInfo,
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
        })
      ).then(() => {
        goBack();
      });
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
    <AppSafeAreaView
      loading={[customerUiState, houseInfoUiState].indexOf(IN_PROGRESS) > 0}
    >
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
              {customer.firstName} {customer.lastName}
            </Text>
            {customer.addresses && customer.addresses.length > 0 && (
              <>
                <Text>{customer.addresses[0].street}</Text>
                <Text>
                  {customer.addresses[0].state}, {customer.addresses[0].city}{" "}
                  {customer.addresses[0].zip}
                </Text>
                <Text>{customer.phones[0].number}</Text>
                <Text>{customer.customerId}</Text>
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
