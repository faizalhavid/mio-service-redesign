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
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import TermsAndConditions from "../../components/TermsAndConditions";
import { popToPop } from "../../navigations/rootNavigation";
import AppInput from "../../components/AppInput";
import { Controller, useForm } from "react-hook-form";
import { SvgCss } from "react-native-svg";
import {
  FILLED_CIRCLE_CLOSE_ICON,
  FILLED_CIRCLE_TICK_ICON,
} from "../../commons/assets";
import { StorageHelper } from "../../services/storage-helper";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCustomer } from "../../slices/customer-slice";
import {
  getSavedCardsAsync,
  saveCardAsync,
  selectCards,
  selectSaveCard,
} from "../../slices/card-slice";
import {
  selectValidateCoupon,
  validateCouponAsync,
} from "../../slices/coupon-slice";
import { selectLead, updateLeadAsync } from "../../slices/lead-slice";
import {
  createOrderFromLeadAsync,
  selectCreateOrder,
} from "../../slices/order-slice";
import { IN_PROGRESS } from "../../commons/ui-states";
import PriceBreakdown from "./PriceBreakdown";
import { SaveCardType } from "../../commons/types";
import { AddCardBottomSheet } from "../../components/AddCardBottomSheet";

const Payment = (): JSX.Element => {
  const [showTNC, setShowTNC] = React.useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedCreditcard, setSelectedCreditcard] = useState<string>();
  const [couponCode, setCouponCode] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [couponValidity, setCouponValidity] = React.useState<
    "INIT" | "VALID" | "INVALID"
  >("INIT");
  const [couponMsg, setCouponMsg] = React.useState("");
  const dispatch = useAppDispatch();
  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);

  const {
    uiState: cardsUiState,
    collection: cards,
    error: cardsError,
  } = useAppSelector(selectCards);

  const {
    uiState: saveCardUiState,
    member: saveCard,
    error: saveCardError,
  } = useAppSelector(selectSaveCard);

  const {
    uiState: leadUiState,
    member: leadDetails,
    error: leadError,
  } = useAppSelector(selectLead);

  const {
    uiState: validateCouponUiState,
    member: validateCoupon,
    error: validateCouponError,
  } = useAppSelector(selectValidateCoupon);

  const { uiState: createOrderUiState } = useAppSelector(selectCreateOrder);

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

  return (
    <AppSafeAreaView
      loading={
        [
          leadUiState,
          cardsUiState,
          customerUiState,
          saveCardUiState,
          validateCouponUiState,
          createOrderUiState,
        ].indexOf(IN_PROGRESS) >= 0
      }
    >
      <ScrollView mt={16}>
        <VStack space={5}>
          <PriceBreakdown />
          <Divider thickness={10} />
          <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
            Choose Credit Card
          </Text>
          <Divider thickness={1} />
          <View pl={0}>
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
                    <Radio key={index} ml={2} my={1} value={card.id}>
                      {formatNumber(card.number)}
                    </Radio>
                  );
                })}
                <Button
                  _text={{ color: AppColors.DARK_TEAL }}
                  variant={"ghost"}
                  ml={2}
                  my={1}
                  _pressed={{
                    backgroundColor: AppColors.LIGHT_TEAL,
                  }}
                  onPress={() => {
                    setShowAddCard(true);
                  }}
                >
                  Add Credit Card
                </Button>
              </VStack>
            </Radio.Group>
          </View>
          <Divider thickness={10} />
          <VStack>
            <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
              Apply Promo Code
            </Text>
            <Divider thickness={1} mt={5} />
            <VStack px={5}>
              <AppInput
                type={"text"}
                label={"Code"}
                onChange={(text) => {
                  setCouponCode(text);
                }}
                suffix={
                  <Button
                    _pressed={{
                      backgroundColor: "#eee",
                    }}
                    _text={{
                      color: AppColors.SECONDARY,
                    }}
                    p={1}
                    variant={"ghost"}
                    onPress={() => {
                      dispatch(
                        validateCouponAsync({
                          code: couponCode,
                          leadId: leadDetails.leadId,
                        })
                      ).then((response) => {
                        let _validateCoupon = response.payload;
                        if (_validateCoupon.isValid) {
                          setCouponValidity("VALID");
                        } else {
                          setCouponValidity("INVALID");
                        }
                        setCouponMsg(_validateCoupon.message);
                      });
                    }}
                  >
                    Apply
                  </Button>
                }
              />
              {couponValidity === "VALID" && (
                <HStack space={1.5} alignItems="center">
                  <SvgCss
                    xml={FILLED_CIRCLE_TICK_ICON(AppColors.DARK_PRIMARY)}
                  />
                  <Text fontWeight={"semibold"} color={AppColors.DARK_PRIMARY}>
                    {couponMsg}
                  </Text>
                </HStack>
              )}
              {couponValidity === "INVALID" && (
                <HStack space={1.5} alignItems="center">
                  <SvgCss xml={FILLED_CIRCLE_CLOSE_ICON("#FF5733")} />
                  <Text fontWeight={"semibold"} color={"#FF5733"}>
                    {couponMsg}
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
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
      {/* {selectedCreditcard && selectedCreditcard !== "NEW" && ( */}
      <FooterButton
        label="PLACE ORDER"
        disabled={!selectedCreditcard}
        subText="Choose credit card for payment"
        onPress={async () => {
          let payload = {
            ...leadDetails,
            creditCard: {
              ...leadDetails.creditCard,
              qbCardId: selectedCreditcard,
            },
            promoCode: {
              id: couponValidity === "VALID" ? couponCode : undefined,
            },
          };
          await dispatch(updateLeadAsync(payload));
          await dispatch(
            createOrderFromLeadAsync({ leadId: leadDetails.leadId })
          );
          await StorageHelper.removeValue("LEAD_ID");
          // TODO: reset lead state
          popToPop("Booked");
        }}
      />
      {showAddCard && (
        <AddCardBottomSheet
          showAddCard={showAddCard}
          setShowAddCard={setShowAddCard}
        />
      )}
      {/* )} */}
    </AppSafeAreaView>
  );
};

export default Payment;
