import { Center, Divider, ScrollView, Text } from "native-base";
import React from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ServiceCard from "../../components/ServiceCard";

const UpcomingServices = (): JSX.Element => {
  return (
    <AppSafeAreaView>
      <Center mb={2}>
        <Text fontSize={20}>Upcoming Services</Text>
      </Center>
      <ScrollView px={3}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v, index) => (
          <ServiceCard
            key={index}
            variant="outline"
            showAddToCalendar={true}
            showReschedule={true}
            showChat={true}
            w="100%"
          />
        ))}
        <Divider thickness={0} mt={200} />
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default UpcomingServices;
