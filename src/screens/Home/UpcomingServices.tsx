import { Center, Divider, FlatList, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { Order } from "../../commons/types";
import { IN_PROGRESS } from "../../commons/ui-states";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ServiceCard from "../../components/ServiceCard";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { getReadableDateTime } from "../../services/utils";
import {
  getUpcomingOrdersAsync,
  selectUpcomingOrders,
} from "../../slices/order-slice";
import { SERVICES } from "./ChooseService";

const UpcomingServices = (): JSX.Element => {
  const [page, setPage] = React.useState<number>(1);
  const [fetchAgain, setFetchAgain] = React.useState<boolean>(true);
  const [orderId, setOrderId] = React.useState<string>("");
  const [subOrderId, setSubOrderId] = React.useState<string>("");
  const limit = 10;

  const dispatch = useAppDispatch();

  const {
    uiState: upcomingOrdersUiState,
    collection: upcomingOrders,
    error: upcomingOrdersError,
  } = useAppSelector(selectUpcomingOrders);

  useEffect(() => {
    dispatch(getUpcomingOrdersAsync({ orderId, subOrderId, limit })).then(
      () => {
        if (upcomingOrders.length > 0) {
          let lastOrder = upcomingOrders[upcomingOrders.length - 1];
          setOrderId(lastOrder.orderId);
          setSubOrderId(lastOrder.subOrderId);
        }
        if (upcomingOrders.length < limit) {
          setFetchAgain(false);
        }
      }
    );
  }, [page]);

  return (
    <AppSafeAreaView loading={[upcomingOrdersUiState].indexOf(IN_PROGRESS) > 0}>
      <Center mb={2}>
        <Text fontSize={20}>Upcoming Services</Text>
      </Center>
      <VStack px={3}>
        <FlatList
          ListFooterComponent={
            <>
              {/* <Center>
                <Spinner size="sm" />
              </Center> */}
              <Divider thickness={0} mt={200} />
            </>
          }
          ListEmptyComponent={
            <Center mt={2} fontStyle={"italic"}>
              No upcoming services are there!
            </Center>
          }
          onEndReached={() => {
            if (fetchAgain) {
              setPage(page + 1);
            }
          }}
          data={upcomingOrders}
          renderItem={({ item, index }: { item: Order; index: number }) => (
            <ServiceCard
              key={index}
              variant={"outline"}
              w={"100%"}
              dateTime={item.appointmentDateTime}
              showAddToCalendar={true}
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
        />
      </VStack>
    </AppSafeAreaView>
  );
};

export default UpcomingServices;
function useCallback(arg0: () => Order[]): Order[] {
  throw new Error("Function not implemented.");
}
