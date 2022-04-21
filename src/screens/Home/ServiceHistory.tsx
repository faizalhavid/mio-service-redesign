import { Center, Divider, FlatList, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { Order } from "../../commons/types";
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
  const limit = 10;
  const dispatch = useAppDispatch();

  const {
    uiState: pastOrdersUiState,
    collection: pastOrders,
    error: pastOrdersError,
  } = useAppSelector(selectPastOrders);

  useEffect(() => {
    dispatch(getPastOrdersAsync({ orderId, subOrderId, limit })).then(() => {
      if (pastOrders.length > 0) {
        let lastOrder = pastOrders[pastOrders.length - 1];
        setOrderId(lastOrder.orderId);
        setSubOrderId(lastOrder.subOrderId);
      }
      if (pastOrders.length < limit) {
        setFetchAgain(false);
      }
    });
  }, [page]);

  return (
    <AppSafeAreaView loading={[pastOrdersUiState].indexOf(IN_PROGRESS) > 0}>
      <Center mb={2}>
        <Text fontSize={20}>Service History</Text>
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
              No past services are there!
            </Center>
          }
          onEndReached={() => {
            if (fetchAgain) {
              setPage(page + 1);
            }
          }}
          data={pastOrders}
          renderItem={({ item, index }: { item: Order; index: number }) => (
            <ServiceCard
              key={index}
              variant="outline"
              w={"100%"}
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
        />
      </VStack>
    </AppSafeAreaView>
  );
};

export default ServiceHistory;
