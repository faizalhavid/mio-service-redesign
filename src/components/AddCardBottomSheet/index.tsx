import {
  Actionsheet,
  Center,
  KeyboardAvoidingView,
  ScrollView,
  Spacer,
  Text,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Keyboard, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../commons/colors";
import { SaveCardType } from "../../commons/types";
import { FAILED } from "../../commons/ui-states";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  saveCardAsync,
  getSavedCardsAsync,
  selectSaveCard,
} from "../../slices/card-slice";
import { selectCustomer } from "../../slices/customer-slice";
import AppInput from "../AppInput";
import ErrorView from "../ErrorView";
import FooterButton from "../FooterButton";
import KeyboardSpacer from "react-native-keyboard-spacer";

type AddCardBottomSheetProps = {
  showAddCard: boolean;
  setShowAddCard: Function;
};

export const AddCardBottomSheet = ({
  showAddCard,
  setShowAddCard,
}: AddCardBottomSheetProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState("");

  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);

  const {
    uiState: saveCardUiState,
    member: saveCard,
    error: saveCardError,
  } = useAppSelector(selectSaveCard);

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<SaveCardType>({
    defaultValues: {},
    mode: "onChange",
  });

  const onSubmit = async (data: SaveCardType) => {
    Keyboard.dismiss();
    setErrorMsg("");
    data.expMonth = data.expiry.split("/")[0];
    data.expYear = data.expiry.split("/")[1];
    dispatch(
      saveCardAsync({
        customerId: customer.customerId,
        data: { card: { ...data, expiry: undefined } },
      })
    ).then((response) => {
      let savedCard = response.payload;
      if (![200, 201].includes(savedCard?.qbStatus)) {
        setErrorMsg("Invalid Card Credentials!");
      } else {
        dispatch(getSavedCardsAsync({ customerId: customer.customerId }));
        setShowAddCard(false);
      }
    });
  };

  return (
    <Actionsheet
      isOpen={showAddCard}
      onClose={() => setShowAddCard(false)}
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
        <ScrollView width={"100%"}>
          <VStack pt={15} bg={"white"} width="100%">
            <Center>
              <Text fontSize={18} fontWeight="semibold">
                Add Card
              </Text>
            </Center>
            <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} />
            {/* <KeyboardAwareScrollView
            enableOnAndroid={true}
            style={{
              padding: 0,
              margin: 0,
            }}
          > */}
            {/* <KeyboardAvoidingView
              behavior={Platform.OS == "ios" ? "padding" : undefined}
              style={{ flex: 1 }}
            > */}
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
                    label="Name"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="name"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    type="number"
                    label="Card Number"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="number"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                  pattern: /[0-9]{2}\/[0-9]{4}/gi,
                  validate: (value) => {
                    if (value && value.length > 0) {
                      let month = value.substring(0, 2);
                      let year = value.substring(3, 7);
                      if (!Number(month) || Number(month) > 12) {
                        return false;
                      } else if (
                        !Number(year) ||
                        Number(year) < new Date().getFullYear()
                      ) {
                        return false;
                      } else if (
                        Number(year) === new Date().getFullYear() &&
                        Number(month) < new Date().getMonth() + 1
                      ) {
                        return false;
                      } else {
                        return true;
                      }
                    }
                    return false;
                  },
                }}
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { invalid },
                }) => (
                  <>
                    <AppInput
                      type="number"
                      expiry={false}
                      label="Valid thru (MM/YYYY)"
                      onChange={onChange}
                      value={value}
                    />
                    {invalid && (
                      <Text fontSize={12} color={"red.600"}>
                        Please follow format - MM/YYYY
                      </Text>
                    )}
                  </>
                )}
                name="expiry"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    type="password"
                    label="CVV"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="cvc"
              />
            </VStack>
            {/* </KeyboardAvoidingView> */}
            {/* </KeyboardAwareScrollView> */}
          </VStack>
          {Platform.OS === "ios" && <KeyboardSpacer />}
        </ScrollView>
        <FooterButton
          disabled={!isValid}
          loading={saveCardUiState === "IN_PROGRESS"}
          minLabel="SAVE"
          maxLabel={"CREDIT CARD"}
          type="DEFAULT"
          onPress={handleSubmit(onSubmit)}
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
};
