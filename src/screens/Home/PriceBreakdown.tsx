import { Divider, HStack, Text, VStack } from "native-base";
import React, { useMemo } from "react";
import { AppColors } from "../../commons/colors";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectLead } from "../../slices/lead-slice";
import { SERVICES } from "./ChooseService";

const PriceBreakdown = (): JSX.Element => {
  const { member: leadDetails } = useAppSelector(selectLead);

  // const totalAmount = useMemo(() => {
  //   let sum = 0;
  //   if (leadDetails) {
  //   }
  //   return sum;
  // }, [leadDetails]);

  return (
    <VStack space={2}>
      <Divider thickness={1} />
      <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
        Summary
      </Text>
      <Divider thickness={1} />
      {leadDetails.subOrders.map((subOrder, index) => (
        <HStack key={index} px={5} justifyContent={"space-between"}>
          <Text fontSize={14}>{SERVICES[subOrder.serviceId].text}</Text>
          <Text fontSize={14}>
            <Text fontSize={12} color={AppColors.AAA}>
              {subOrder.flags.recurringDuration}
            </Text>{" "}
            ${subOrder.servicePrice.cost}
          </Text>
        </HStack>
      ))}
      <Divider thickness={1} />
      {/* <HStack justifyContent={"space-between"}>
        <Text fontSize={14} fontWeight={"semibold"}>
          Total Amount
        </Text>
        <Text fontSize={14} fontWeight={"semibold"}>
          40 $
        </Text>
      </HStack>
      <Divider thickness={1} /> */}
      <Text px={5} fontSize={12}>
        **Amount will be deducted on the day of service
      </Text>
    </VStack>
  );
};

export default PriceBreakdown;
