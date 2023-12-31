import { Center, Divider, Image, Pressable, Text, View, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { AppColors } from '../../commons/colors';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import FloatingButton from '../../components/FloatingButton';
import ServiceCard from '../../components/ServiceCard';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { navigate, popToPop } from '../../navigations/rootNavigation';
import { useAnalytics } from '../../services/analytics';
import { StorageHelper } from '../../services/storage-helper';
import { getReadableDateTime } from '../../services/utils';
import { SERVICES } from '../Home/ChooseService';

import UpcomingPast from '../../components/UpcomingPast';
import VirtualizedView from '../../components/VirtualizedView';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { isAddressExists } from '../../services/address-validation';
import {
  getCustomerByIdAsync,
  selectAddress,
  selectCustomer,
  updateAddressAsync,
} from '../../slices/customer-slice';
import { selectFirstOrder, selectUpcomingOrders } from '../../slices/order-slice';
import { getServicesAsync } from '../../slices/service-slice';

function Home(): JSX.Element {
  const dispatch = useAppDispatch();

  const {
    member: { data: upcomingOrders = [] },
    uiState: upcomingOrdersUiState,
  } = useAppSelector(selectUpcomingOrders);

  const { uiState: customerUiState, member: customer } = useAppSelector(selectCustomer);

  const { uiState: addressUiState } = useAppSelector(selectAddress);

  const { addressExists } = isAddressExists();

  const { logout, isViewer, currentUser } = useAuth();
  const { setUserId } = useAnalytics();

  const [contentReady, setContentReady] = useState<boolean>(false);
  const isAuthenticated = useAuthenticatedUser();

  const init = React.useCallback(async () => {
    StorageHelper.getValue('CUSTOMER_ID').then(async (cId) => {
      setUserId(cId || '');
      if (cId) {
        // console.log("Get Customer", cId);
        const result = await dispatch(getCustomerByIdAsync(cId));
        // console.log("result-home", result);
        if (!result?.payload?.customerId || result.meta.requestStatus === 'rejected') {
          await logout();
          popToPop('Welcome');
        }
      }
    });
    dispatch(getServicesAsync());
  }, []);

  useEffect(() => {
    init();
  }, []);

  // useEffect(() => {
  //   if (!currentUser?.email) {
  //     logout();
  //     popToPop('Welcome');
  //   }
  // }, [currentUser]);

  useEffect(() => {
    if (
      customerUiState === 'SUCCESS' &&
      upcomingOrdersUiState === 'SUCCESS' &&
      addressUiState !== 'IN_PROGRESS'
    ) {
      setContentReady(true);
    }
    if (!isAuthenticated) {
      setContentReady(true);
    }
  }, [customerUiState, upcomingOrdersUiState, addressExists, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && customer?.customerId) {
      StorageHelper.getValue('LOCAL_ADDRESS').then((localAddress) => {
        if (localAddress) {
          const payload: any = {
            ...JSON.parse(localAddress),
            isPrimary: true,
            serviceAccountId: customer.sAccountId,
          };
          dispatch(updateAddressAsync(payload)).then((response) => {
            if (response.meta.requestStatus === 'fulfilled') {
              StorageHelper.removeValue('LOCAL_ADDRESS');
              dispatch(getCustomerByIdAsync(customer.customerId));
              navigate('ChooseSchedule');
            }
          });
        }
      });
    }
  }, [customer, isAuthenticated]);

  const { member: firstOrder } = useAppSelector(selectFirstOrder);

  const [readableDateTime, setReadableDateTime] = useState<any>({});

  useEffect(() => {
    if (Object.keys(firstOrder).length > 0) {
      setReadableDateTime(getReadableDateTime(firstOrder.appointmentDateTime));
    }
  }, [firstOrder]);

  return (
    <AppSafeAreaView loading={!contentReady} bg={AppColors.EEE}>
      <VirtualizedView>
        <VStack>
          {contentReady && (
            <View px={3}>
              {(!isAuthenticated || upcomingOrders.length === 0) &&
                upcomingOrdersUiState !== 'IN_PROGRESS' && (
                  <Pressable
                    borderRadius={10}
                    borderWidth={1}
                    borderColor={AppColors.TEAL}
                    width="100%"
                    bg="white"
                    mt={5}
                    _pressed={{
                      backgroundColor: 'white',
                    }}
                    onPress={async () => {
                      StorageHelper.setValue('COUPON_SELECTED', 'NC20P');
                      if (isAuthenticated) {
                        if (addressExists) {
                          navigate('ChooseService');
                        } else {
                          navigate('EditAddress', {
                            returnTo: 'ChooseService',
                            mode: 'NEW_ADDRESS',
                          });
                        }
                      } else {
                        const localAddress = await StorageHelper.getValue('LOCAL_ADDRESS');
                        if (localAddress) {
                          navigate('ChooseService');
                        } else {
                          navigate('EditAddress', {
                            returnTo: 'ChooseService',
                            mode: 'NEW_ADDRESS',
                          });
                        }
                      }
                    }}
                  >
                    <VStack space={5} width="100%">
                      <Center py={5} bg={AppColors.TEAL} borderTopRadius={5}>
                        <Image
                          w={20}
                          h={12}
                          alt="Logo"
                          source={require('../../assets/images/mio-logo-white.png')}
                        />
                      </Center>
                    </VStack>
                    <VStack py={3} space={5}>
                      <Center>
                        <Text fontWeight="semibold" fontSize={16} color={AppColors.DARK_TEAL}>
                          Create your first service
                        </Text>
                        <Text fontSize={12} fontStyle="italic" color={AppColors.DARK_TEAL}>
                          Get 20% off on your first order with NC20P
                        </Text>
                      </Center>
                    </VStack>
                  </Pressable>
                )}
              {upcomingOrders && upcomingOrders.length > 0 && Object.keys(firstOrder).length > 0 && (
                <>
                  <Divider mt={5} thickness={0} />
                  <ServiceCard
                    variant="solid"
                    dateTime={firstOrder?.appointmentDateTime}
                    showWelcomeMessage
                    showAddToCalendar
                    showReschedule={!isViewer}
                    showChat={!isViewer}
                    serviceName={SERVICES[firstOrder?.serviceId].text}
                    orderId={firstOrder?.orderId}
                    subOrderId={firstOrder?.subOrderId}
                    year={readableDateTime?.year}
                    date={readableDateTime?.date}
                    month={readableDateTime?.month}
                    day={readableDateTime?.day}
                    slot={readableDateTime?.slot}
                  />
                </>
              )}
              <Divider my={1} thickness={0} />
            </View>
          )}
          {isAuthenticated && <UpcomingPast />}
        </VStack>
      </VirtualizedView>
      {!isViewer && isAuthenticated && <FloatingButton />}
    </AppSafeAreaView>
  );
}

export default Home;
