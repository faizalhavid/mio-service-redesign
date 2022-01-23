import { Divider, HStack, Text, VStack } from "native-base";
import React from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";

const PriceBreakdown = (): JSX.Element => {
  return (
    <VStack px={5} space={2}>
      <Text fontSize={14} fontWeight={"semibold"}>
        PRICE DETAILS
      </Text>
      <Divider thickness={1} />
      <HStack justifyContent={"space-between"}>
        <Text fontSize={14}>Lawn Service</Text>
        <Text fontSize={14}>40 $</Text>
      </HStack>
      <HStack justifyContent={"space-between"}>
        <Text fontSize={14}>Lawn Service</Text>
        <Text fontSize={14}>40 $</Text>
      </HStack>
      <Divider thickness={1} />
      <HStack justifyContent={"space-between"}>
        <Text fontSize={14} fontWeight={"semibold"}>
          Total Amount
        </Text>
        <Text fontSize={14} fontWeight={"semibold"}>
          40 $
        </Text>
      </HStack>
      <Divider thickness={1} />
      <Text fontSize={12}>**Amount will be deducted on the day of service</Text>
    </VStack>
  );
};

export default PriceBreakdown;
