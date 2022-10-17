import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Center, Divider, HStack, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { AppColors } from '../../commons/colors';
import { IN_PROGRESS } from '../../commons/ui-states';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import CancelOrderBottomSheet from '../../components/CancelOrderBottomSheet';
import JobCompletedBottomSheet from '../../components/JobCompletedBottomSheet';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { SuperRootStackParamList } from '../../navigations';
import { getReadableDateTime } from '../../services/utils';
import { selectCustomer } from '../../slices/customer-slice';
import { getOrderDetailsAsync, selectOrderDetails } from '../../slices/order-slice';
import { HOUSE_CLEANING_ID, LAWN_CARE_ID, SERVICES } from './ChooseService';
import Notes from './Notes';

type ViewServiceDetailsProps = NativeStackScreenProps<
  SuperRootStackParamList,
  'ViewServiceDetails'
>;
function ViewServiceDetails({ route }: ViewServiceDetailsProps): JSX.Element {
  const { orderId, subOrderId } = route.params;
  const [showCancelOrder, setShowCancelOrder] = useState<boolean>(false);
  const [showJobCompleted, setShowJobCompleted] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const { isViewer } = useAuth();

  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);

  const {
    uiState: orderDetailUiState,
    member: orderDetail,
    error: orderDetailError,
  } = useAppSelector(selectOrderDetails);

  useEffect(() => {
    if (orderId && subOrderId) {
      dispatch(getOrderDetailsAsync({ orderId, subOrderId }));
    } else {
    }
  }, [orderId, subOrderId]);

  function Title({ text }: { text: string }): JSX.Element {
    return (
      <Text color={AppColors.DARK_PRIMARY} letterSpacing={1} fontSize={12}>
        {text}
      </Text>
    );
  }

  function ValueText({ text }: { text: string | number }): JSX.Element {
    return (
      <Text color={AppColors.SECONDARY} textTransform="uppercase" fontWeight="semibold">
        {text || '-'}
      </Text>
    );
  }

  function OverviewCard(): JSX.Element {
    return (
      <VStack bg="white" mx={3} p={5} borderRadius={10}>
        <Title text="OVERVIEW" />
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

        <VStack space={3}>
          <HStack justifyContent="space-between">
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                SERVICE PROVIDER
              </Text>
              <ValueText text="Mio Home Services" />
            </VStack>
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                ORDER #
              </Text>
              <ValueText text={orderDetail?.subOrderId} />
            </VStack>
          </HStack>
          <HStack justifyContent="space-between">
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                STATUS
              </Text>
              <ValueText text={orderDetail?.flags?.status} />
            </VStack>
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                SERVICE TYPE
              </Text>
              <ValueText text={SERVICES[orderDetail?.serviceId]?.text} />
            </VStack>
          </HStack>
          <HStack justifyContent="space-between">
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                SCHEDULED DATE
              </Text>
              <ValueText
                text={`${
                  getReadableDateTime(orderDetail?.appointmentInfo?.appointmentDateTime).month
                } ${getReadableDateTime(orderDetail?.appointmentInfo?.appointmentDateTime).date}, ${
                  getReadableDateTime(orderDetail?.appointmentInfo?.appointmentDateTime).year
                }`}
              />
            </VStack>
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                TIME SLOT
              </Text>
              <ValueText
                text={getReadableDateTime(orderDetail?.appointmentInfo?.appointmentDateTime).slot}
              />
            </VStack>
          </HStack>
          {['NEW', 'ACTIVE', 'RESCHEDULED', 'CANCELLATION-FAILED'].indexOf(
            orderDetail?.flags?.status
          ) >= 0 &&
            !isViewer && (
              <Button
                variant="outline"
                _pressed={{
                  bgColor: AppColors.LIGHT_TEAL,
                }}
                borderColor={AppColors.TEAL}
                borderWidth={0.8}
                onPress={() => setShowJobCompleted(true)}
              >
                <Center>
                  <Text color={AppColors.TEAL}>Mark as Job Completed</Text>
                </Center>
              </Button>
            )}
        </VStack>
      </VStack>
    );
  }

  function ServiceDetailsCard(): JSX.Element {
    return (
      <VStack bg="white" mx={3} p={5} borderRadius={10}>
        <Title text="SERVICE DETAILS" />
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

        <VStack space={3}>
          <HStack justifyContent="space-between">
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                PLAN
              </Text>
              <ValueText text={orderDetail?.flags?.plan} />
            </VStack>
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                DURATION
              </Text>
              <ValueText text={orderDetail?.flags?.recurringDuration} />
            </VStack>
          </HStack>
          <VStack>
            <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
              PROPERTY DETAILS
            </Text>
            {orderDetail.serviceId === LAWN_CARE_ID && (
              <ValueText text={`${orderDetail.area} SQFT (AREA)`} />
            )}
            {orderDetail.serviceId === HOUSE_CLEANING_ID && (
              <ValueText
                text={`${orderDetail.bedrooms} (BEDROOM) | ${orderDetail.bathrooms} (BATHROOM)`}
              />
            )}
          </VStack>
        </VStack>
      </VStack>
    );
  }

  function AddressCard(): JSX.Element {
    return (
      <VStack bg="white" mx={3} p={5} borderRadius={10}>
        <Title text="ADDRESS" />
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

        <VStack space={3}>
          <HStack justifyContent="space-between">
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                STREET
              </Text>
              <ValueText text={orderDetail?.customerProfile?.addresses[0]?.street} />
            </VStack>
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                CITY
              </Text>
              <ValueText text={orderDetail?.customerProfile?.addresses[0]?.city} />
            </VStack>
          </HStack>
          <HStack justifyContent="space-between">
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                STATE
              </Text>
              <ValueText text={orderDetail?.customerProfile?.addresses[0]?.state} />
            </VStack>
            <VStack width="50%">
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                ZIP
              </Text>
              <ValueText text={orderDetail?.customerProfile?.addresses[0]?.zip} />
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    );
  }

  function CancelOrderAction(): JSX.Element {
    return ['NEW', 'ACTIVE', 'SCHEDULED', 'RESCHEDULED', 'CANCELLATION-FAILED'].indexOf(
      orderDetail?.flags?.status
    ) >= 0 && !isViewer ? (
      <Button
        variant="outline"
        mx={3}
        _pressed={{
          bgColor: 'red.100',
        }}
        borderColor="red.600"
        borderWidth={0.8}
        onPress={() => setShowCancelOrder(true)}
      >
        <Text color="red.600">Cancel Order</Text>
      </Button>
    ) : (
      <></>
    );
  }

  function ServiceInfoRoute() {
    return (
      <>
        <ScrollView pt={3}>
          <VStack space={3} pb={20}>
            <OverviewCard />
            <ServiceDetailsCard />
            <AddressCard />
            <CancelOrderAction />
            <Divider mt={100} thickness={0} />
          </VStack>
        </ScrollView>
        {showCancelOrder && (
          <CancelOrderBottomSheet
            orderId={orderId}
            showCancelOrder={showCancelOrder}
            setShowCancelOrder={setShowCancelOrder}
          />
        )}
        {showJobCompleted && (
          <JobCompletedBottomSheet
            orderId={orderId}
            subOrderId={subOrderId}
            showJobCompleted={showJobCompleted}
            setShowJobCompleted={setShowJobCompleted}
          />
        )}
      </>
    );
  }

  function NotesRoute() {
    return <Notes />;
  }

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: AppColors.SECONDARY }}
      style={{ backgroundColor: AppColors.WHITE }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color: AppColors.SECONDARY, fontSize: 12, fontWeight: '500' }}>
          {route.title}
        </Text>
      )}
    />
  );

  const renderScene = SceneMap({
    serviceInfo: ServiceInfoRoute,
    notes: NotesRoute,
  });

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'serviceInfo', title: 'SERVICE INFO' },
    { key: 'notes', title: 'NOTES' },
  ]);

  return (
    <AppSafeAreaView
      mt={42}
      bg={AppColors.EEE}
      loading={[customerUiState, orderDetailUiState].indexOf(IN_PROGRESS) > 0}
    >
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={renderTabBar}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{ marginTop: 35 }}
      />
    </AppSafeAreaView>
  );
}

export default ViewServiceDetails;
