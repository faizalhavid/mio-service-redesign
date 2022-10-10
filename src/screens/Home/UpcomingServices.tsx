import { Center, Divider, Spinner, Text, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { SectionList } from 'react-native';
import { GroupedOrder, Order } from '../../commons/types';
import ServiceCard from '../../components/ServiceCard';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { getReadableDateTime } from '../../services/utils';
import {
  getUpcomingOrdersAsync,
  selectUpcomingOrders,
  setFirstOrder,
} from '../../slices/order-slice';
import { SERVICES } from './ChooseService';

function UpcomingServices(): JSX.Element {
  const [page, setPage] = React.useState<number>(1);
  const [fetchAgain, setFetchAgain] = React.useState<boolean>(true);
  const [orderId, setOrderId] = React.useState<string>('');
  const [subOrderId, setSubOrderId] = React.useState<string>('');
  const [upcomingOrders, setUpcomingOrders] = React.useState<GroupedOrder[]>([]);
  const limit = 10;
  const { isViewer } = useAuth();

  const dispatch = useAppDispatch();

  const { uiState: upcomingOrdersUiState, member: upcomingOrdersState } =
    useAppSelector(selectUpcomingOrders);

  const isAuthenticated = useAuthenticatedUser();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    dispatch(
      getUpcomingOrdersAsync({
        orderId,
        subOrderId,
        limit,
      })
    ).then((response) => {
      // console.log("get upcoming services", response.payload);
      // console.log("get upcoming services", response.meta.requestStatus);
      const orders = response.payload.data;
      if (orders.length > 0) {
        const lastOrder = orders[orders.length - 1];
        setOrderId(lastOrder.orderId);
        setSubOrderId(lastOrder.subOrderId);
        const groupedOrders: { [key: string]: any[] } = {};

        // Build Old Data
        for (const order of upcomingOrders) {
          groupedOrders[order.month] = order.data;
        }

        // Build New Data
        for (const order of orders) {
          const { month, year } = getReadableDateTime(order.appointmentDateTime);
          const title = `${month} ${year}`;
          groupedOrders[title] = groupedOrders[title] ? groupedOrders[title] : [];
          groupedOrders[title].push(order);
        }
        const currentOrders: GroupedOrder[] = Object.entries(groupedOrders).map(([key, value]) => ({
          month: key,
          data: value,
        }));

        if (page === 1 && orders.length > 0) {
          dispatch(setFirstOrder({ order: {} as Order }));
          for (const order of orders) {
            if (order.status !== 'CANCELED') {
              dispatch(setFirstOrder({ order }));
              break;
            }
          }
        }

        setUpcomingOrders(currentOrders);
      }
      if (orders.length < limit) {
        setFetchAgain(false);
      }
    });
  }, [page, isAuthenticated]);

  return (
    <VStack px={3}>
      <SectionList
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {upcomingOrdersUiState === 'IN_PROGRESS' && (
              <Center mt={3}>
                <Spinner size="sm" />
              </Center>
            )}
            <Divider thickness={0} mt={50} />
          </>
        }
        ListEmptyComponent={
          !['INIT', 'IN_PROGRESS'].includes(upcomingOrdersUiState) ? (
            <Center mt={2} fontStyle="italic">
              No upcoming services are there!
            </Center>
          ) : (
            <></>
          )
        }
        ItemSeparatorComponent={() => <Divider thickness={0} mt={3} />}
        onEndReached={() => {
          if (fetchAgain) {
            setPage(page + 1);
          }
        }}
        renderItem={({ item, index }: { item: Order; index: number }) => (
          <ServiceCard
            key={index}
            variant="outline"
            w="100%"
            dateTime={item.appointmentDateTime}
            status={item.status}
            showAddToCalendar={item.status !== 'CANCELED'}
            showReschedule={!isViewer}
            showChat={!isViewer}
            serviceName={SERVICES[item.serviceId]?.text}
            orderId={item.orderId}
            subOrderId={item.subOrderId}
            year={getReadableDateTime(item.appointmentDateTime).year}
            date={getReadableDateTime(item.appointmentDateTime).date}
            day={getReadableDateTime(item.appointmentDateTime).day}
            slot={getReadableDateTime(item.appointmentDateTime).slot}
          />
        )}
        sections={upcomingOrders}
        stickyHeaderHiddenOnScroll
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text px={3} fontSize={16} my={2} fontWeight="semibold">
            {section.month}
          </Text>
        )}
      />
    </VStack>
  );
}

export default UpcomingServices;
