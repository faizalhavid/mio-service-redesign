import { Button, Divider, HStack, Pressable, Text, VStack } from "native-base";
import React from "react";
import { Linking } from "react-native";
import { SvgCss } from "react-native-svg";
import {
  ADD_CALENDAR_ICON,
  ADD_RESCHEDULE_ICON,
  CHAT_ICON,
  RESCHEDULE_ICON,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import { navigate } from "../../navigations/rootNavigation";
import { addToCalendar } from "../../services/calendar";
import { Reschedule } from "../Reschedule";

type ServiceCardProps = {
  variant: "solid" | "outline";
  showWelcomeMessage?: boolean;
  showAddToCalendar?: boolean;
  showReschedule?: boolean;
  showChat?: boolean;
  w?: string;
  dateTime: string;
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
  dateTime,
  showWelcomeMessage,
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
  const outlineColor = AppColors.TEAL;
  const isOutline = variant === "outline";
  const borderWidth = isOutline ? 1 : 0;
  const bg = isOutline ? "#fff" : outlineColor;
  const textColor = isOutline ? outlineColor : "#fff";
  const width = w || (isOutline ? 300 : "100%");
  const [showRescheduleSheet, setShowRescheduleSheet] =
    React.useState<boolean>(false);
  return (
    <Pressable
      onPress={() => navigate("ViewServiceDetails", { orderId, subOrderId })}
    >
      <VStack
        paddingY={4}
        paddingX={5}
        mt={5}
        borderRadius={20}
        borderWidth={borderWidth}
        borderColor={outlineColor}
        bg={bg}
        shadow={3}
        width={width}
      >
        {isOutline ? (
          <>
            <Text fontWeight={"semibold"} fontSize={18} color={"#000"}>
              {serviceName} Service
            </Text>
            <Text fontSize={14} color={"#000"}>
              {date}, {slot}
            </Text>
            {showAddToCalendar && (
              <Divider color={AppColors.TEAL} thickness={1} marginY={3} />
            )}
            <HStack space={3} justifyContent="space-between">
              {showAddToCalendar && (
                <Button
                  padding={0}
                  variant={"ghost"}
                  onPress={() => {
                    addToCalendar(serviceName, dateTime);
                  }}
                >
                  <HStack
                    space={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <SvgCss xml={ADD_CALENDAR_ICON()} />
                    <Text
                      fontWeight={"bold"}
                      fontSize={14}
                      color={AppColors.PRIMARY}
                    >
                      Add
                    </Text>
                  </HStack>
                </Button>
              )}
              {showReschedule && (
                <Button
                  padding={0}
                  variant={"ghost"}
                  onPress={() => {
                    setShowRescheduleSheet(true);
                  }}
                >
                  <HStack
                    space={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <SvgCss xml={ADD_RESCHEDULE_ICON()} />
                    <Text
                      fontWeight={"bold"}
                      fontSize={14}
                      color={AppColors.PRIMARY}
                    >
                      Reschedule
                    </Text>
                  </HStack>
                </Button>
              )}
              {showChat && (
                <Button
                  padding={0}
                  variant={"ghost"}
                  onPress={() => {
                    Linking.openURL(
                      `mailto:support@miohomeservices.com?subject=[${orderId}] Service Notes&body=Hi, \n\n Order ID: ${orderId} \n Service Name: ${serviceName} \n\n Service Note: \n`
                    );
                  }}
                >
                  <HStack
                    space={2}
                    alignItems={"center"}
                    justifyContent={"center"}
                  >
                    <SvgCss width={15} height={15} xml={CHAT_ICON()} />
                    <Text
                      fontWeight={"bold"}
                      fontSize={14}
                      color={AppColors.PRIMARY}
                    >
                      Note
                    </Text>
                  </HStack>
                </Button>
              )}
              {!showAddToCalendar && !showReschedule && !showChat && (
                <Button
                  mt={3}
                  px={3}
                  py={1}
                  borderWidth={1}
                  borderColor={AppColors.TEAL}
                  variant={"outline"}
                  onPress={() => {
                    navigate("ViewServiceDetails", { orderId, subOrderId });
                  }}
                >
                  <Text
                    fontWeight={"bold"}
                    fontSize={14}
                    color={AppColors.TEAL}
                  >
                    Details
                  </Text>
                </Button>
              )}
            </HStack>
          </>
        ) : (
          <>
            {showWelcomeMessage && (
              <Text fontSize={16} color={textColor}>
                Your {serviceName} Service is scheduled for
              </Text>
            )}
            <Text fontSize={28} color={textColor}>
              {day}
            </Text>
            <Text fontSize={28} color={textColor}>
              {date}, {year}
            </Text>
            {showAddToCalendar && <Divider thickness={1} marginY={3} />}
            <HStack space={3}>
              {showAddToCalendar && (
                <Button
                  variant={"outline"}
                  borderRadius={5}
                  borderColor="white"
                  bg="white"
                  width={"45%"}
                  onPress={() => {
                    addToCalendar(serviceName, dateTime);
                  }}
                >
                  <Text fontWeight={"bold"} fontSize={14} color={"#000"}>
                    Add to calendar
                  </Text>
                </Button>
              )}
              {showReschedule && (
                <Button
                  variant={"outline"}
                  borderRadius={5}
                  borderColor="white"
                  width={"40%"}
                  onPress={() => {
                    setShowRescheduleSheet(true);
                  }}
                >
                  <Text fontSize={14} color={"#fff"}>
                    Reschedule
                  </Text>
                </Button>
              )}
              {showChat && (
                <HStack
                  space={1}
                  alignItems={"center"}
                  justifyContent={"center"}
                >
                  <SvgCss width={15} height={15} xml={CHAT_ICON(textColor)} />
                  <Text fontSize={12} color={textColor}>
                    Chat
                  </Text>
                </HStack>
              )}
            </HStack>
          </>
        )}
      </VStack>
      <Reschedule
        isOpen={showRescheduleSheet}
        setOpen={setShowRescheduleSheet}
        orderId={orderId}
        serviceName={serviceName}
      />
    </Pressable>
  );
};

export default ServiceCard;
