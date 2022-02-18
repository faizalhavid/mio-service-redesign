import { Center, Divider, ScrollView, Text } from "native-base";
import React from "react";
import { useQuery } from "react-query";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ServiceCard from "../../components/ServiceCard";
import { getAllOrders } from "../../services/order";
import { getReadableDateTime } from "../../services/utils";
import { Order } from "../Dashboard/Home";
import { SERVICES } from "./ChooseService";

const UpcomingServices = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);

  const [upcomingOrders, setUpcomingOrders] = React.useState<Order[]>([]);
  const getAllUpcomingOrdersQuery = useQuery(
    "getAllUpcomingOrders",
    () => {
      setLoading(true);
      return getAllOrders("upcoming");
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setUpcomingOrders(data.data[0]);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );
  return (
    <AppSafeAreaView loading={loading}>
      <Center mb={2}>
        <Text fontSize={20}>Upcoming Services</Text>
      </Center>
      <ScrollView px={3}>
        {upcomingOrders.map((order: Order, index: number) => {
          return (
            <ServiceCard
              key={index}
              variant="outline"
              w={"100%"}
              showAddToCalendar={false}
              serviceName={SERVICES[order.serviceId].text}
              orderId={order.orderId}
              subOrderId={order.subOrderId}
              year={getReadableDateTime(order.appointmentDateTime).year}
              date={getReadableDateTime(order.appointmentDateTime).date}
              day={getReadableDateTime(order.appointmentDateTime).day}
              slot={getReadableDateTime(order.appointmentDateTime).slot}
            />
          );
        })}
        <Divider thickness={0} mt={200} />
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default UpcomingServices;
