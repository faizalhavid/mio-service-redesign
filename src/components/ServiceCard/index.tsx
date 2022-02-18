import { Divider, HStack, Pressable, Text, VStack } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import {
  ADD_CALENDAR_ICON,
  CHAT_ICON,
  RESCHEDULE_ICON,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import { navigate } from "../../navigations/rootNavigation";

type ServiceCardProps = {
  variant: "solid" | "outline";
  showAddToCalendar?: boolean;
  showReschedule?: boolean;
  showChat?: boolean;
  w?: string;
  serviceName: string;
  date: string;
  day: string;
  slot: string;
  year: string;
  orderId: string;
  subOrderId: string;
};

const ServiceCard = ({
  variant,
  showAddToCalendar,
  showReschedule,
  showChat,
  w,
  serviceName,
  date,
  day,
  slot,
  year,
  orderId,
  subOrderId,
}: ServiceCardProps): JSX.Element => {
  // const outlineColor = "#43a4ab";
  const outlineColor = AppColors.SECONDARY;
  const isOutline = variant === "outline";
  const borderWidth = isOutline ? 1 : 0;
  const bg = isOutline ? "#fff" : outlineColor;
  const textColor = isOutline ? outlineColor : "#fff";
  const width = w || (isOutline ? 300 : "100%");
  return (
    <Pressable
      onPress={() => navigate("ViewServiceDetails", { orderId, subOrderId })}
    >
      <VStack
        paddingY={4}
        paddingX={5}
        mt={5}
        borderRadius={10}
        borderWidth={borderWidth}
        borderColor={outlineColor}
        bg={bg}
        shadow={3}
        width={width}
      >
        <HStack justifyContent={"space-between"}>
          <Text fontWeight={"semibold"} fontSize={14} color={textColor}>
            {serviceName}
          </Text>
          <Text fontWeight={"semibold"} fontSize={14} color={textColor}>
            {slot}
          </Text>
        </HStack>
        <Text fontSize={18} color={textColor}>
          {date}, {year}
        </Text>
        <Text fontSize={14} color={textColor}>
          {day}
        </Text>
        {showAddToCalendar && <Divider thickness={1} marginY={3} />}
        <HStack justifyContent={"space-between"}>
          {showAddToCalendar && (
            <HStack space={1} alignItems={"center"} justifyContent={"center"}>
              <SvgCss
                width={15}
                height={15}
                xml={ADD_CALENDAR_ICON(textColor)}
              />
              <Text fontSize={12} color={textColor}>
                Add to calendar
              </Text>
            </HStack>
          )}
          {showReschedule && (
            <HStack space={1} alignItems={"center"} justifyContent={"center"}>
              <SvgCss width={15} height={15} xml={RESCHEDULE_ICON(textColor)} />
              <Text fontSize={12} color={textColor}>
                Reschedule
              </Text>
            </HStack>
          )}
          {showChat && (
            <HStack space={1} alignItems={"center"} justifyContent={"center"}>
              <SvgCss width={15} height={15} xml={CHAT_ICON(textColor)} />
              <Text fontSize={12} color={textColor}>
                Chat
              </Text>
            </HStack>
          )}
        </HStack>
      </VStack>
    </Pressable>
  );
};

export default ServiceCard;
