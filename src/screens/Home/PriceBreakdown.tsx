import { Divider, HStack, Text, VStack } from "native-base";
import React, { useMemo } from "react";
import { AppColors } from "../../commons/colors";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectLead } from "../../slices/lead-slice";
import { SERVICES } from "./ChooseService";

const PriceBreakdown = (): JSX.Element => {
  const { member: leadDetails } = useAppSelector(selectLead);

  return (
    <VStack space={3}>
      <Divider bgColor={"gray.200"} thickness={1} />
      <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
        Summary
      </Text>
      <Divider bgColor={"gray.200"} thickness={1} />
      {leadDetails.subOrders.map((subOrder, index) => (
        <VStack
          key={index}
          borderWidth={1}
          borderTopWidth={3}
          borderRadius={10}
          borderColor={"gray.200"}
          mx={3}
          borderTopColor={AppColors.LIGHT_TEAL}
          py={2}
          space={1}
        >
          <HStack px={3} justifyContent={"space-between"}>
            <Text fontSize={14}>{SERVICES[subOrder.serviceId].text}</Text>
            <Text fontSize={14} color={AppColors.SECONDARY}>
              ${subOrder.servicePrice.cost}
            </Text>
          </HStack>
          <HStack px={3} justifyContent={"space-between"}>
            <Text fontSize={14}>Trust & Support Fee</Text>
            <Text fontSize={14} color={AppColors.SECONDARY}>
              ${leadDetails.subOrders[0].servicePrice.trustFee}
            </Text>
          </HStack>
          <Divider bgColor={"gray.200"} thickness={1} />
          <HStack px={3} justifyContent={"space-between"}>
            <Text fontSize={14} fontWeight="semibold">
              {subOrder.flags.recurringDuration === "ONCE"
                ? "ONE-TIME"
                : subOrder.flags.recurringDuration}
            </Text>
            <Text
              fontSize={16}
              color={AppColors.SECONDARY}
              fontWeight="semibold"
            >
              $
              {leadDetails.subOrders[0].servicePrice.trustFee +
                subOrder.servicePrice.cost}
            </Text>
          </HStack>
          <HStack px={3} justifyContent={"space-between"}>
            <Text fontSize={10} mt={-1}>
              TOTAL
            </Text>
            <Text fontSize={10} mt={-1} color={AppColors.SECONDARY}>
              PER SERVICE
            </Text>
          </HStack>
        </VStack>
      ))}
      <Divider bgColor={"gray.200"} thickness={1} />
      <Text px={5} fontSize={12} color={AppColors.SECONDARY}>
        **Amount will be deducted on the day of service
      </Text>
    </VStack>
  );
};

export default PriceBreakdown;
