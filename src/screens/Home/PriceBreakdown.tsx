import { Divider, HStack, Text, VStack } from "native-base";
import React, { useMemo } from "react";
import { AppColors } from "../../commons/colors";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectValidateCoupon } from "../../slices/coupon-slice";
import { selectLead } from "../../slices/lead-slice";
import { SERVICES } from "./ChooseService";

const PriceBreakdown = (): JSX.Element => {
  const { member: leadDetails } = useAppSelector(selectLead);
  const {
    uiState: validateCouponUiState,
    member: validateCoupon,
    error: validateCouponError,
  } = useAppSelector(selectValidateCoupon);
  const cost = useMemo(() => {
    let total: any = 0;
    let discountedTotal: any = 0;
    let discountedServiceId = "";
    let discountedService = validateCoupon?.applicableServices?.[0];
    if (leadDetails?.subOrders?.length > 0) {
      let packageDiscountedCost = leadDetails.subOrders.reduce(
        (prev, current) => {
          if (discountedService) {
            if (current.serviceId === discountedService.serviceId) {
              discountedServiceId = current.serviceId;
              return prev + (discountedService.costAfterDiscount || 0);
            }
          }
          return (
            prev +
            (current?.servicePrice?.cost || 0) +
            (current?.servicePrice?.trustFee || 0)
          );
        },
        0
      );
      let packageCost = leadDetails.subOrders.reduce(
        (prev, current) => prev + (current?.servicePrice?.cost || 0),
        0
      );
      let trustFee = leadDetails.subOrders.reduce(
        (prev, current) => prev + (current?.servicePrice?.trustFee || 0),
        0
      );
      if (discountedServiceId) {
        discountedTotal = packageDiscountedCost.toFixed(2);
      }
      total = (packageCost + trustFee).toFixed(2);
    }

    return { total, discountedTotal, discountedServiceId };
  }, [leadDetails, validateCoupon]);
  return (
    <VStack space={3}>
      <Divider bgColor={"gray.200"} thickness={1} />
      <HStack justifyContent={"space-between"} px={5}>
        <Text fontSize={16} fontWeight={"semibold"}>
          Summary
        </Text>
        <HStack alignItems={"center"} space={1}>
          <Text
            pr={0.5}
            fontSize={12}
            fontWeight="semibold"
            color={AppColors.TEAL}
          >
            TOTAL
          </Text>
          <Text fontSize={16} fontWeight={"semibold"}>
            ${cost.discountedTotal || cost.total}
          </Text>
          {cost.discountedTotal !== 0 && (
            <Text
              fontSize={12}
              fontWeight={600}
              color={AppColors.AAA}
              textDecorationLine="line-through"
            >
              ${cost.total}
            </Text>
          )}
        </HStack>
      </HStack>
      <Divider bgColor={"gray.200"} thickness={1} />
      {leadDetails?.subOrders?.map((subOrder, index) => (
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
            <Text fontSize={14} fontWeight="semibold">
              {SERVICES[subOrder.serviceId].text}{" "}
              {cost.discountedServiceId === subOrder.serviceId && (
                <Text
                  fontSize={12}
                  fontWeight={600}
                  color={AppColors.DARK_PRIMARY}
                >
                  (Coupon Applied)
                </Text>
              )}
            </Text>
            <Text
              fontSize={14}
              color={AppColors.SECONDARY}
              fontWeight="semibold"
            >
              ${subOrder.servicePrice.cost}
            </Text>
          </HStack>
          <HStack px={3} justifyContent={"space-between"}>
            <Text fontSize={12}>Trust & Support Fee</Text>
            <Text fontSize={12} color={AppColors.SECONDARY}>
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
      <Text px={5} pb={3} fontSize={12} color={AppColors.SECONDARY}>
        **Amount will be deducted on the day of service
      </Text>
    </VStack>
  );
};

export default PriceBreakdown;
