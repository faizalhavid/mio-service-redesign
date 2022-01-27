import { Center, Text } from "native-base";
import React from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";

const ViewServiceDetails = (): JSX.Element => {
  return (
    <AppSafeAreaView>
      <Center mb={2}>
        <Text fontSize={20}>Service Details</Text>
      </Center>
    </AppSafeAreaView>
  );
};

export default ViewServiceDetails;
