import { Actionsheet, Center, Pressable, Text, VStack } from 'native-base';
import React, { useState } from 'react';
import { AppColors } from '../../commons/colors';
import { OrderStatus } from '../../commons/types';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import {
  cancelOrderAsync,
  getOrderDetailsAsync,
  selectCancelOrder,
  selectOrderDetails,
} from '../../slices/order-slice';
import { setRefreshNeeded } from '../../slices/shared-slice';
import ErrorView from '../ErrorView';
import FooterButton from '../FooterButton';

type CancelOrderBottomSheetProps = {
  orderId: string;
  showCancelOrder: boolean;
  setShowCancelOrder: Function;
};

function CancelOrderBottomSheet({
  orderId,
  showCancelOrder,
  setShowCancelOrder,
}: CancelOrderBottomSheetProps): JSX.Element {
  const [cancelType, setCancelType] = useState<'ALL' | 'ONCE'>('ONCE');
  const { member: orderDetail } = useAppSelector(selectOrderDetails);
  const dispatch = useAppDispatch();
  const { member: cancelOrder, uiState: cancelOrderUiState } = useAppSelector(selectCancelOrder);
  const [errorMsg, setErrorMsg] = useState('');
  return (
    <Actionsheet
      isOpen={showCancelOrder}
      onClose={() => setShowCancelOrder(false)}
      hideDragIndicator
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
        <VStack pt={15} bg="white" width="100%">
          <Center>
            <Text fontSize={18} fontWeight="semibold">
              Cancel Order
            </Text>
          </Center>
          <VStack mt={3} px={4} pb={75} bg={AppColors.EEE}>
            <ErrorView message={errorMsg} />
            {orderDetail?.flags?.recurringDuration === 'ONCE' && (
              <VStack my={3} space={2}>
                <Text color={AppColors.TEAL} fontWeight="semibold">
                  Cancel Current Order
                </Text>
                <Text fontSize={12} color="amber.600" fontWeight="semibold">
                  This action will cancel the current scheduled order.
                </Text>
              </VStack>
            )}
            {orderDetail?.flags?.recurringDuration !== 'ONCE' && (
              <VStack my={3} space={2}>
                <Pressable
                  borderRadius={5}
                  width="100%"
                  px={3}
                  py={3}
                  justifyContent="center"
                  borderWidth={cancelType === 'ONCE' ? 1 : 0}
                  borderColor={AppColors.TEAL}
                  bg={cancelType === 'ONCE' ? AppColors.LIGHT_TEAL : '#fff'}
                  _pressed={{
                    borderColor: AppColors.TEAL,
                    borderWidth: 1,
                    backgroundColor: AppColors.LIGHT_TEAL,
                  }}
                  onPress={() => {
                    setCancelType('ONCE');
                  }}
                >
                  <VStack>
                    <Text color={AppColors.TEAL} fontWeight="semibold">
                      Cancel Current Order
                    </Text>
                    <Text fontSize={12} color="amber.600" fontWeight="semibold">
                      This action will cancel the current scheduled order.
                    </Text>
                  </VStack>
                </Pressable>
                <Pressable
                  borderRadius={5}
                  width="100%"
                  px={3}
                  py={3}
                  justifyContent="center"
                  borderWidth={cancelType === 'ALL' ? 1 : 0}
                  borderColor={AppColors.TEAL}
                  bg={cancelType === 'ALL' ? AppColors.LIGHT_TEAL : '#fff'}
                  _pressed={{
                    borderColor: AppColors.TEAL,
                    borderWidth: 1,
                    backgroundColor: AppColors.LIGHT_TEAL,
                  }}
                  onPress={() => {
                    setCancelType('ALL');
                  }}
                >
                  <VStack>
                    <Text color={AppColors.TEAL} fontWeight="semibold">
                      Cancel All Upcoming Orders
                    </Text>
                    <Text fontSize={12} color="amber.600" fontWeight="semibold">
                      This action will delete all the upcoming orders.
                    </Text>
                  </VStack>
                </Pressable>
              </VStack>
            )}
          </VStack>

          <FooterButton
            loading={cancelOrderUiState === 'IN_PROGRESS'}
            label="CANCEL ORDER"
            type="DEFAULT"
            onPress={() => {
              dispatch(
                cancelOrderAsync({
                  type: cancelType,
                  orderId,
                  subOrderId: orderDetail.subOrderId,
                  dateTime: orderDetail.appointmentInfo.appointmentDateTime,
                })
              ).then((response) => {
                const result: OrderStatus = response.payload;
                if (result.status === 'SUCCESS') {
                  setShowCancelOrder(false);
                  dispatch(
                    getOrderDetailsAsync({
                      orderId,
                      subOrderId: orderDetail.subOrderId,
                    })
                  );
                  dispatch(setRefreshNeeded({ data: { UPCOMING_SERVICES: true } }));
                } else {
                  setErrorMsg(result.message);
                }
              });
            }}
            onCancel={() => setShowCancelOrder(false)}
          />
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
}

export default CancelOrderBottomSheet;
