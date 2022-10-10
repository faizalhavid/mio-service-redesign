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
} from 'native-base';
import React, { useEffect, useState } from 'react';
import { SvgCss } from 'react-native-svg';
import { AppColors } from '../../commons/colors';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import FooterButton from '../../components/FooterButton';
import TermsAndConditions from '../../components/TermsAndConditions';
import { popToPop } from '../../navigations/rootNavigation';
import AppInput from '../../components/AppInput';
import { FILLED_CIRCLE_CLOSE_ICON, FILLED_CIRCLE_TICK_ICON } from '../../commons/assets';
import { StorageHelper } from '../../services/storage-helper';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectCustomer } from '../../slices/customer-slice';
import { getSavedCardsAsync, selectCards, selectSaveCard } from '../../slices/card-slice';
import { selectValidateCoupon, validateCouponAsync } from '../../slices/coupon-slice';
import { selectLead, updateLeadAsync } from '../../slices/lead-slice';
import { createOrderFromLeadAsync, selectCreateOrder } from '../../slices/order-slice';
import { IN_PROGRESS } from '../../commons/ui-states';
import PriceBreakdown from './PriceBreakdown';
import { AddCardBottomSheet } from '../../components/AddCardBottomSheet';

function Payment(): JSX.Element {
  const [showTNC, setShowTNC] = React.useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [selectedCreditcard, setSelectedCreditcard] = useState<string>();
  const [couponCode, setCouponCode] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [couponValidity, setCouponValidity] = React.useState<'INIT' | 'VALID' | 'INVALID'>('INIT');
  const [couponMsg, setCouponMsg] = React.useState('');
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
      dispatch(getSavedCardsAsync({ customerId: customer.customerId })).then(() => {
        if (cards.length > 0) {
          setSelectedCreditcard(cards[0].id);
        }
      });
    }
    StorageHelper.getValue('COUPON_SELECTED').then((coupon) => {
      if (coupon !== null) {
        setCouponCode(coupon);
        validateCouponCode(coupon);
      }
    });
  }, [customer]);

  const validateCouponCode = async (coupon?: string) => {
    dispatch(
      validateCouponAsync({
        code: coupon || couponCode,
        leadId: leadDetails.leadId,
      })
    ).then((response) => {
      const _validateCoupon = response.payload;
      if (_validateCoupon.isValid) {
        setCouponValidity('VALID');
      } else {
        setCouponValidity('INVALID');
      }
      setCouponMsg(_validateCoupon.message);
    });
  };

  const formatNumber = (number: string) =>
    number
      .split(/(.{4})/)
      .filter((x) => x.length === 4)
      .join('-')
      .toUpperCase();

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
      <ScrollView pt={70}>
        <VStack space={0}>
          <PriceBreakdown />
          <Divider thickness={10} />
          <Text fontSize={16} px={5} py={3} fontWeight="semibold">
            Choose Credit Card
          </Text>
          <Divider bgColor="gray.200" thickness={1} />
          <View pl={2} pt={cards.length > 0 ? 3 : 0}>
            <Radio.Group
              value={selectedCreditcard || ''}
              name="myRadioGroup"
              accessibilityLabel="Choose"
              onChange={(nextValue) => {
                setSelectedCreditcard(nextValue);
              }}
            >
              <VStack
                width="98%"
                mx={5}
                alignItems="flex-start"
                alignSelf="center"
                justifyContent="space-around"
              >
                {cards.map((card, index) => (
                  <Radio key={index} ml={2} my={1} value={card.id}>
                    {formatNumber(card.number)}
                  </Radio>
                ))}
                <Button
                  _text={{ color: AppColors.DARK_TEAL }}
                  variant="ghost"
                  // ml={2}
                  // my={1}
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
            <Text px={5} py={3} fontSize={16} fontWeight="semibold">
              Apply Promo Code
            </Text>
            <Divider bgColor="gray.200" thickness={1} />
            <VStack px={5} pb={3}>
              <AppInput
                type="text"
                label="Code"
                value={couponCode}
                onChange={(text) => {
                  setCouponCode(text);
                  if (couponValidity === 'VALID' || couponValidity === 'INVALID') {
                    setCouponValidity('INIT');
                  }
                }}
                suffix={
                  <Button
                    _pressed={{
                      backgroundColor: '#eee',
                    }}
                    _text={{
                      color: AppColors.SECONDARY,
                    }}
                    p={1}
                    variant="ghost"
                    onPress={() => {
                      validateCouponCode();
                    }}
                  >
                    Apply
                  </Button>
                }
              />
              {couponValidity === 'VALID' && (
                <HStack space={1.5} alignItems="center">
                  <SvgCss xml={FILLED_CIRCLE_TICK_ICON(AppColors.DARK_PRIMARY)} />
                  <Text fontWeight="semibold" color={AppColors.DARK_PRIMARY}>
                    {couponMsg}
                  </Text>
                </HStack>
              )}
              {couponValidity === 'INVALID' && (
                <HStack space={1.5} alignItems="center">
                  <SvgCss xml={FILLED_CIRCLE_CLOSE_ICON('#FF5733')} />
                  <Text fontWeight="semibold" color="#FF5733">
                    {couponMsg}
                  </Text>
                </HStack>
              )}
            </VStack>
          </VStack>
          <Divider thickness={10} />
        </VStack>
        <Center px={5} py={5}>
          <Button pt={5} m={0} variant="link" onPress={() => setShowTNC(true)}>
            <Text textAlign="center">
              By clicking "Place Order" you agree to {'\n'}our{' '}
              <Text color="blue.500">terms & conditions</Text>
            </Text>
          </Button>
        </Center>
        <Divider thickness={0} mt={0} mb={200} />
      </ScrollView>
      <TermsAndConditions show={showTNC} setShow={setShowTNC} />
      {/* {selectedCreditcard && selectedCreditcard !== "NEW" && ( */}
      <FooterButton
        label="PLACE ORDER"
        type="VIEW_SUMMARY"
        disabled={!selectedCreditcard}
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
        subText="Choose credit card for payment"
        onPress={async () => {
          const payload = {
            ...leadDetails,
            creditCard: {
              ...leadDetails.creditCard,
              qbCardId: selectedCreditcard,
            },
            promoCode: {
              code: couponValidity === 'VALID' ? couponCode : undefined,
            },
          };
          await dispatch(updateLeadAsync(payload));
          await dispatch(createOrderFromLeadAsync({ leadId: leadDetails.leadId }));
          await StorageHelper.removeValue('LEAD_ID');
          await StorageHelper.removeValue('COUPON_SELECTED');
          popToPop('Booked');
        }}
      />
      {showAddCard && (
        <AddCardBottomSheet showAddCard={showAddCard} setShowAddCard={setShowAddCard} />
      )}
      {/* )} */}
    </AppSafeAreaView>
  );
}

export default Payment;
