import {
  Center,
  Divider,
  FlatList,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { ListViewComponent } from "react-native";
import { useMutation, useQuery } from "react-query";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ServiceCard from "../../components/ServiceCard";
import { getAllOrders } from "../../services/order";
import { getReadableDateTime } from "../../services/utils";
import { Order } from "../Dashboard/Home";
import { SERVICES } from "./ChooseService";

const ServiceHistory = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);

  const [pastOrders, setPastOrders] = React.useState<Order[]>([]);
  const [page, setPage] = React.useState<number>(1);
  const [total, setTotal] = React.useState<number>(0);
  const limit = 10;
  const getAllPastOrdersMutation = useMutation(
    "getAllPastOrders",
    (page: number) => {
      setLoading(true);
      return getAllOrders("past", page, limit);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setPastOrders([...pastOrders, ...data.data.data]);
        setTotal(data.data.total);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  useEffect(() => {
    getAllPastOrdersMutation.mutate(page);
  }, [page]);

  return (
    <AppSafeAreaView loading={loading}>
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
            if (page * limit < total) {
              setPage(page + 1);
            }
          }}
          data={pastOrders}
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

export default ServiceHistory;
