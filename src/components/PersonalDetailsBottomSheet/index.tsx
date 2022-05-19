import { Actionsheet, Center, Spacer, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../commons/colors";
import { Phone } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSaveCard } from "../../slices/card-slice";
import { selectCustomer, putCustomerAsync } from "../../slices/customer-slice";
import AppInput from "../AppInput";
import ErrorView from "../ErrorView";
import FooterButton from "../FooterButton";

type PersonalDetailsForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type PersonalDetailsBottomSheetProps = {
  showPersonalDetails: boolean;
  setShowPersonalDetails: Function;
};

export const PersonalDetailsBottomSheet = ({
  showPersonalDetails,
  setShowPersonalDetails,
}: PersonalDetailsBottomSheetProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);

  useEffect(() => {
    if (customer) {
      setValue("firstName", customer.firstName);
      setValue("lastName", customer.lastName);
      setValue("phone", customer.phones[0].number);
      setValue("email", customer.email);
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
    let formValues = getValues();
    dispatch(
      putCustomerAsync({
        ...customer,
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
      setShowPersonalDetails(false);
    });
  };

  return (
    <Actionsheet
      isOpen={showPersonalDetails}
      onClose={() => setShowPersonalDetails(false)}
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
          backgroundColor: AppColors.EEE,
        }}
      >
        <VStack pt={15} bg={"white"} width="100%">
          <Center>
            <Text fontSize={18} fontWeight="semibold">
              Personal Details
            </Text>
          </Center>
          <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} />
          <KeyboardAwareScrollView
            enableOnAndroid={true}
            style={{
              padding: 0,
              margin: 0,
            }}
          >
            <VStack px={4} space={0} pb={75} bg={AppColors.EEE}>
              <ErrorView message={errorMsg} />
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
                    type="email"
                    label="Email"
                    disabled={true}
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="email"
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
            </VStack>
          </KeyboardAwareScrollView>
        </VStack>
        <FooterButton
          disabled={!isValid || customerUiState === "IN_PROGRESS"}
          minLabel="SAVE"
          maxLabel={"PERSONAL DETAILS"}
          type="DEFAULT"
          onPress={handleSubmit(onSubmit)}
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
};
