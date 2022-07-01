import { Center, Divider, Spinner, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { SectionList } from "react-native";
import { GroupedOrder, Order } from "../../commons/types";
import ServiceCard from "../../components/ServiceCard";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { getReadableDateTime } from "../../services/utils";
import {
  getUpcomingOrdersAsync,
  selectUpcomingOrders,
  setFirstOrder,
} from "../../slices/order-slice";
import { SERVICES } from "./ChooseService";

const UpcomingServices = (): JSX.Element => {
  const [page, setPage] = React.useState<number>(1);
  const [fetchAgain, setFetchAgain] = React.useState<boolean>(true);
  const [orderId, setOrderId] = React.useState<string>("");
  const [subOrderId, setSubOrderId] = React.useState<string>("");
  const [upcomingOrders, setUpcomingOrders] = React.useState<GroupedOrder[]>(
    []
  );
  const limit = 10;

  const dispatch = useAppDispatch();

  const { uiState: upcomingOrdersUiState, member: upcomingOrdersState } =
    useAppSelector(selectUpcomingOrders);

  useEffect(() => {
    dispatch(getUpcomingOrdersAsync({ orderId, subOrderId, limit })).then(
      (response) => {
        let orders = response.payload.data;
        if (orders.length > 0) {
          let lastOrder = orders[orders.length - 1];
          setOrderId(lastOrder.orderId);
          setSubOrderId(lastOrder.subOrderId);
          let groupedOrders: { [key: string]: any[] } = {};

          // Build Old Data
          for (let order of upcomingOrders) {
            groupedOrders[order.month] = order.data;
          }

          // Build New Data
          for (let order of orders) {
            let { month, year } = getReadableDateTime(
              order.appointmentDateTime
            );
            let title = `${month} ${year}`;
            groupedOrders[title] = groupedOrders[title]
              ? groupedOrders[title]
              : [];
            groupedOrders[title].push(order);
          }
          let currentOrders: GroupedOrder[] = Object.entries(groupedOrders).map(
            ([key, value]) => {
              return {
                month: key,
                data: value,
              };
            }
          );

          if (page === 1 && orders.length > 0) {
            dispatch(setFirstOrder({ order: {} as Order }));
            for (let order of orders) {
              if (order.status !== "CANCELED") {
                dispatch(setFirstOrder({ order: order }));
                break;
              }
            }
          }

          setUpcomingOrders(currentOrders);
        }
        if (orders.length < limit) {
          setFetchAgain(false);
        }
      }
    );
  }, [page]);

  return (
    <VStack px={3}>
      <SectionList
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <>
            {upcomingOrdersUiState === "IN_PROGRESS" && (
              <Center mt={3}>
                <Spinner size="sm" />
              </Center>
            )}
            <Divider thickness={0} mt={50} />
          </>
        }
        ListEmptyComponent={
          !["INIT", "IN_PROGRESS"].includes(upcomingOrdersUiState) ? (
            <Center mt={2} fontStyle={"italic"}>
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
            variant={"outline"}
            w={"100%"}
            dateTime={item.appointmentDateTime}
            status={item.status}
            showAddToCalendar={item.status !== "CANCELED"}
            showReschedule={true}
            showChat={true}
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
        stickyHeaderHiddenOnScroll={true}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => (
          <Text px={3} fontSize={16} my={2} fontWeight={"semibold"}>
            {section.month}
          </Text>
        )}
      />
    </VStack>
  );
};

export default UpcomingServices;
