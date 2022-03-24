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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useMutation } from "react-query";
import { AppColors } from "../../commons/colors";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { goBack } from "../../navigations/rootNavigation";
import { getSavedCards, saveCard } from "../../services/order";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Controller, useForm } from "react-hook-form";
import { StorageHelper } from "../../services/storage-helper";

export type SaveCardType = {
  name: string;
  number: string;
  expiry: string;
  expMonth: string;
  expYear: string;
  cvc: string;
};

export interface CvcVerification {
  result: string;
  date: Date;
}

export interface ZeroDollarVerification {
  status: string;
}

export interface Card {
  id: string;
  number: string;
  name: string;
  created: Date;
  updated: Date;
  entityVersion: string;
  cvcVerification: CvcVerification;
  cardType: string;
  entityId: string;
  entityType: string;
  numberSHA512: string;
  status: string;
  zeroDollarVerification: ZeroDollarVerification;
  expMonth: string;
  expYear: string;
  default: boolean;
  isBusiness: boolean;
  isLevel3Eligible: boolean;
}

const PaymentMethods = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [customerId, setCustomerId] = React.useState<string | null>(null);
  const [selectedCreditcard, setSelectedCreditcard] = useState<string>();
  const [errorMsg, setErrorMsg] = React.useState("");
  const [savedCards, setSavedCards] = React.useState<Card[]>([]);
  const fetchCustomerProfile = useCallback(async () => {
    let cId = await StorageHelper.getValue("CUSTOMER_ID");
    setCustomerId(cId);
    getSavedCardsMutation.mutate();
  }, []);

  useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

  const getSavedCardsMutation = useMutation(
    "getSavedCards",
    () => {
      setLoading(true);
      return getSavedCards(customerId || "");
    },
    {
      onSuccess: (data) => {
        setSavedCards(data.data);
        if (data.data.length > 0) {
          setSelectedCreditcard(data.data[0].number);
        }
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const saveCardMutation = useMutation(
    "saveCard",
    (payload: SaveCardType) => {
      setErrorMsg("");
      setLoading(true);
      return saveCard(customerId || "", { card: payload });
    },
    {
      onSuccess: (data) => {
        if (![200, 201].includes(data.data?.qbStatus)) {
          setErrorMsg("Invalid Card Credentials!");
        } else {
          getSavedCardsMutation.mutate();
        }
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

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
    setLoading(true);
    data.expMonth = data.expiry.split("/")[0];
    data.expYear = data.expiry.split("/")[1];
    saveCardMutation.mutate(data);
  };

  return (
    <AppSafeAreaView loading={loading}>
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
                {savedCards.map((card, index) => {
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
      {selectedCreditcard && selectedCreditcard !== "NEW" && (
        <FooterButton
          label="SAVE PAYMENT METHOD"
          subText="Choose default payment method or add new card"
          onPress={() => goBack()}
        />
      )}
    </AppSafeAreaView>
  );
};

export default PaymentMethods;
