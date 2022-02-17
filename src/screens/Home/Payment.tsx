import {
  Button,
  Center,
  Divider,
  HStack,
  Input,
  Radio,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import TermsAndConditions from "../../components/TermsAndConditions";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import PriceBreakdown from "./PriceBreakdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppInput from "../../components/AppInput";
import { useMutation } from "react-query";
import { getSavedCards, saveCard } from "../../services/order";
import { Card, SaveCardType } from "./PaymentMethods";
import { Controller, useForm } from "react-hook-form";

const Payment = (): JSX.Element => {
  const [showTNC, setShowTNC] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [customerId, setCustomerId] = React.useState<string | null>(null);
  const [selectedCreditcard, setSelectedCreditcard] = useState<string>();
  const [errorMsg, setErrorMsg] = React.useState("");
  const [savedCards, setSavedCards] = React.useState<Card[]>([]);
  const fetchCustomerProfile = useCallback(async () => {
    let cId = await AsyncStorage.getItem("CUSTOMER_ID");
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
        if (data.data?.message) {
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
    console.log(data);
    data.expMonth = data.expiry.split("/")[0];
    data.expYear = data.expiry.split("/")[1];
    saveCardMutation.mutate(data);
  };

  return (
    <AppSafeAreaView loading={loading}>
      <ScrollView>
        <VStack space={5}>
          <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
            Choose Credit Card
          </Text>
          <Divider thickness={1} />
          <View pl={3}>
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

          <Divider thickness={10} />
        </VStack>
        <Center px={5} py={5}>
          <Button
            pt={5}
            m={0}
            variant={"link"}
            onPress={() => setShowTNC(true)}
          >
            <Text textAlign={"center"}>
              By clicking "Submit Payment" your agree to {"\n"}our{" "}
              <Text color={"blue.500"}>terms & conditions</Text>
            </Text>
          </Button>
        </Center>
        <Divider thickness={0} mt={0} mb={200} />
      </ScrollView>
      <TermsAndConditions show={showTNC} setShow={setShowTNC} />
      {selectedCreditcard && selectedCreditcard !== "NEW" && (
        <FooterButton
          label="SUBMIT PAYMENT"
          disabled={selectedCreditcard === "NEW"}
          subText="Choose credit card for payment"
          onPress={async () => {
            await AsyncStorage.removeItem("LEAD_ID");
            popToPop("Booked");
          }}
        />
      )}
    </AppSafeAreaView>
  );
};

export default Payment;
