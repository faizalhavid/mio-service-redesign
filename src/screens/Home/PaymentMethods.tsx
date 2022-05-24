import {
  Button,
  Center,
  Divider,
  HStack,
  Radio,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../commons/colors";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import { Controller, useForm } from "react-hook-form";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  selectSaveCard,
  getSavedCardsAsync,
  selectCards,
  saveCardAsync,
} from "../../slices/card-slice";
import { selectCustomer } from "../../slices/customer-slice";
import { IN_PROGRESS } from "../../commons/ui-states";
import { SaveCardType } from "../../commons/types";

const PaymentMethods = (): JSX.Element => {
  const [selectedCreditcard, setSelectedCreditcard] = useState<string>();
  const [errorMsg, setErrorMsg] = React.useState("");
  const dispatch = useAppDispatch();
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
    uiState: cardsUiState,
    collection: cards,
    error: cardsError,
  } = useAppSelector(selectCards);

  useEffect(() => {
    if (customer) {
      dispatch(getSavedCardsAsync({ customerId: customer.customerId })).then(
        () => {
          if (cards.length > 0) {
            setSelectedCreditcard(cards[0].id);
          }
        }
      );
    }
  }, [customer]);

  const formatNumber = (number: string) => {
    return number
      .split(/(.{4})/)
      .filter((x) => x.length == 4)
      .join("-")
      .toUpperCase();
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<SaveCardType>({
    defaultValues: {},
    mode: "onChange",
  });

  const onSubmit = async (data: SaveCardType) => {
    data.expMonth = data.expiry.split("/")[0];
    data.expYear = data.expiry.split("/")[1];
    dispatch(
      saveCardAsync({ customerId: customer.customerId, data: data })
    ).then(() => {
      if (![200, 201].includes(saveCard?.qbStatus)) {
        setErrorMsg("Invalid Card Credentials!");
      } else {
        dispatch(getSavedCardsAsync({ customerId: customer.customerId }));
      }
    });
  };

  return (
    <AppSafeAreaView
      loading={
        [cardsUiState, customerUiState, saveCardUiState].indexOf(IN_PROGRESS) >
        0
      }
    >
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <ScrollView>
          <Center>
            <Text fontSize={20} pt={5}>
              Payment Methods
            </Text>
          </Center>
          <Divider thickness={0} mt={5} />
          <HStack
            bg={AppColors.PRIMARY}
            shadow={2}
            px={6}
            py={2}
            justifyContent={"space-between"}
            alignContent={"center"}
          >
            <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
              Default Payment Source
            </Text>
          </HStack>
          <View px={2} pt={4}>
            <Radio.Group
              value={selectedCreditcard || ""}
              name="myRadioGroup"
              accessibilityLabel="Choose"
              onChange={(nextValue) => {
                setSelectedCreditcard(nextValue);
              }}
            >
              <VStack
                width={"98%"}
                mx={5}
                alignItems={"flex-start"}
                alignSelf={"center"}
                justifyContent={"space-around"}
              >
                {cards.map((card, index) => {
                  return (
                    <Radio key={index} ml={2} my={1} value={card.number}>
                      {formatNumber(card.number)}
                    </Radio>
                  );
                })}
                <Radio ml={2} my={1} value="NEW">
                  Add Credit Card
                </Radio>
              </VStack>
            </Radio.Group>
          </View>
          <Divider thickness={0} mt={5} />
          {selectedCreditcard === "NEW" && (
            <>
              <HStack
                bg={AppColors.PRIMARY}
                shadow={2}
                px={6}
                py={2}
                justifyContent={"space-between"}
                alignContent={"center"}
              >
                <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
                  Add Credit Card
                </Text>
              </HStack>
              <View px={5}>
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
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <AppInput
                      type="number"
                      expiry={true}
                      label="Valid thru (MM/YYYY)"
                      onChange={onChange}
                      value={value}
                    />
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
                <Center>
                  <Text fontWeight={"semibold"} color={"red.600"}>
                    {errorMsg}
                  </Text>
                </Center>
                <Button
                  mt={5}
                  bg={AppColors.DARK_PRIMARY}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text color={"#fff"}>Add</Text>
                </Button>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
      {/* {selectedCreditcard && selectedCreditcard !== "NEW" && (
        <FooterButton
          label="SAVE"
          subText="Choose default payment method or add new card"
          onPress={() => goBack()}
        />
      )} */}
    </AppSafeAreaView>
  );
};

export default PaymentMethods;
