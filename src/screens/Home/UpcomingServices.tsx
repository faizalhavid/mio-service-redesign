import { Center, Divider, FlatList, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { useMutation } from "react-query";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ServiceCard from "../../components/ServiceCard";
import { getAllOrders } from "../../services/order";
import { getReadableDateTime } from "../../services/utils";
import { Order } from "../Dashboard/Home";
import { SERVICES } from "./ChooseService";

const UpcomingServices = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);

  const [upcomingOrders, setUpcomingOrders] = React.useState<Order[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [fetchAgain, setFetchAgain] = React.useState<boolean>(true);
  const limit = 10;
  const getAllUpcomingOrdersMutation = useMutation(
    "getAllUpcomingOrders",
    (page: number) => {
      setLoading(true);
      return getAllOrders("upcoming", page, limit);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        let orders = data.data.data || [];
        setUpcomingOrders([...upcomingOrders, ...orders]);
        if (orders.length < limit) {
          setFetchAgain(false);
        }
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  useEffect(() => {
    getAllUpcomingOrdersMutation.mutate(page);
  }, [page]);

  return (
    <AppSafeAreaView loading={loading}>
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
              variant="outline"
              w={"100%"}
              showAddToCalendar={false}
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
