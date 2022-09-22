import { Center, Divider, FlatList, Spinner, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { SectionList } from "react-native";
import { GroupedOrder, Order } from "../../commons/types";
import { IN_PROGRESS } from "../../commons/ui-states";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ServiceCard from "../../components/ServiceCard";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { getReadableDateTime } from "../../services/utils";
import { getPastOrdersAsync, selectPastOrders } from "../../slices/order-slice";
import { SERVICES } from "./ChooseService";

const ServiceHistory = (): JSX.Element => {
  const [page, setPage] = React.useState<number>(1);
  const [fetchAgain, setFetchAgain] = React.useState<boolean>(true);
  const [orderId, setOrderId] = React.useState<string>("");
  const [subOrderId, setSubOrderId] = React.useState<string>("");
  const [pastOrders, setPastOrders] = React.useState<GroupedOrder[]>([]);
  const limit = 10;
  const dispatch = useAppDispatch();

  const {
    uiState: pastOrdersUiState,
    collection: pastOrdersState,
    error: pastOrdersError,
  } = useAppSelector(selectPastOrders);

  useEffect(() => {
    dispatch(getPastOrdersAsync({ orderId, subOrderId, limit })).then(
      (response) => {
        let orders = response.payload.data;
        if (orders.length > 0) {
          let lastOrder = orders[orders.length - 1];
          setOrderId(lastOrder.orderId);
          setSubOrderId(lastOrder.subOrderId);
          let groupedOrders: { [key: string]: any[] } = {};
          // Build Old Data
          for (let order of pastOrders) {
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
          setPastOrders(currentOrders);
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
            {pastOrdersUiState === "IN_PROGRESS" && (
              <Center mt={3}>
                <Spinner size="sm" />
              </Center>
            )}
            <Divider thickness={0} mt={50} />
          </>
        }
        ListEmptyComponent={
          !["INIT", "IN_PROGRESS"].includes(pastOrdersUiState) ? (
            <Center mt={2} fontStyle={"italic"}>
              No past services are there!
            </Center>
          ) : (
            <></>
          )
        }
        onEndReached={() => {
          if (fetchAgain) {
            setPage(page + 1);
          }
        }}
        ItemSeparatorComponent={() => <Divider thickness={0} mt={3} />}
        data={pastOrders}
        renderItem={({ item, index }: { item: Order; index: number }) => (
          <ServiceCard
            key={index}
            variant="outline"
            w={"100%"}
            type="PAST"
            dateTime={item.appointmentDateTime}
            showAddToCalendar={false}
            showReschedule={false}
            showChat={false}
            serviceName={SERVICES[item.serviceId]?.text}
            orderId={item.orderId}
            subOrderId={item.subOrderId}
            year={getReadableDateTime(item.appointmentDateTime).year}
            date={getReadableDateTime(item.appointmentDateTime).date}
            day={getReadableDateTime(item.appointmentDateTime).day}
            slot={getReadableDateTime(item.appointmentDateTime).slot}
          />
        )}
        sections={pastOrders}
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

export default ServiceHistory;
