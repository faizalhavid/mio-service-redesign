import {
  Box,
  Button,
  Divider,
  HStack,
  Pressable,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { Linking } from "react-native";
import { LinearGradient, SvgCss } from "react-native-svg";
import {
  ADD_CALENDAR_ICON,
  ADD_RESCHEDULE_ICON,
  BOX_ARROW_RIGHT_ICON,
  CHAT_ICON,
  CHEVRON_RIGHT_ICON,
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
  month?: string;
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
  month,
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
      <VStack>
        {isOutline ? (
          <>
            <HStack
              bg={"white"}
              borderWidth={1}
              borderColor="white"
              justifyContent={"space-between"}
              p={3}
              borderTopRadius={10}
              borderBottomRadius={showAddToCalendar ? 0 : 10}
            >
              <HStack>
                <VStack
                  alignItems={"center"}
                  borderRadius={10}
                  bg={AppColors.LIGHT_TEAL}
                  px={5}
                  py={2}
                >
                  <Text
                    fontSize={12}
                    color={AppColors.SECONDARY}
                    textTransform="uppercase"
                    fontWeight={"semibold"}
                  >
                    {day?.substring(0, 3)}
                  </Text>
                  <Text
                    fontSize={16}
                    color={AppColors.SECONDARY}
                    fontWeight={"semibold"}
                  >
                    {date}
                  </Text>
                </VStack>
                <VStack pl={3}>
                  <Text
                    fontSize={16}
                    color={AppColors.SECONDARY}
                    fontWeight={"semibold"}
                  >
                    {serviceName} Service
                  </Text>
                  <Text
                    fontSize={14}
                    fontWeight="semibold"
                    color={AppColors.AAA}
                  >
                    {slot}
                  </Text>
                </VStack>
              </HStack>
              <SvgCss
                style={{ marginTop: 8 }}
                xml={CHEVRON_RIGHT_ICON(AppColors.TEAL)}
              />
            </HStack>
            {showAddToCalendar && (
              <HStack
                borderTopWidth={1}
                borderTopColor={AppColors.EEE}
                borderBottomRadius={10}
                px={4}
                pt={3}
                pb={1}
                justifyContent="space-between"
                bg={"white"}
              >
                {showAddToCalendar && (
                  <Text
                    fontSize={14}
                    color={AppColors.TEAL}
                    fontWeight={"semibold"}
                    onPress={() => {
                      addToCalendar(serviceName, dateTime);
                    }}
                  >
                    <HStack space={2} alignItems={"center"}>
                      <SvgCss
                        width={15}
                        xml={ADD_CALENDAR_ICON(AppColors.TEAL)}
                      />
                      <Text
                        fontWeight={"bold"}
                        fontSize={14}
                        color={AppColors.TEAL}
                      >
                        Calendar
                      </Text>
                    </HStack>
                  </Text>
                )}
                {showReschedule && (
                  <Text
                    fontSize={14}
                    color={AppColors.TEAL}
                    fontWeight={"semibold"}
                    onPress={() => {
                      setShowRescheduleSheet(true);
                    }}
                  >
                    <HStack space={2} alignItems={"center"}>
                      <SvgCss
                        width={15}
                        xml={ADD_RESCHEDULE_ICON(AppColors.TEAL)}
                      />
                      <Text
                        fontWeight={"bold"}
                        fontSize={14}
                        color={AppColors.TEAL}
                      >
                        Reschedule
                      </Text>
                    </HStack>
                  </Text>
                )}
                {showChat && (
                  <Text
                    fontSize={14}
                    color={AppColors.TEAL}
                    fontWeight={"semibold"}
                    onPress={() => {
                      Linking.openURL(
                        `mailto:support@miohomeservices.com?subject=[${orderId}] Service Notes&body=Hi, \n\n Order ID: ${orderId} \n Service Name: ${serviceName} \n\n Service Note: \n`
                      );
                    }}
                  >
                    <HStack space={2} alignItems={"center"}>
                      <SvgCss width={15} xml={CHAT_ICON(AppColors.TEAL)} />
                      <Text
                        fontWeight={"bold"}
                        fontSize={14}
                        color={AppColors.TEAL}
                      >
                        Note
                      </Text>
                    </HStack>
                  </Text>
                )}
              </HStack>
            )}
          </>
        ) : (
          <>
            <VStack
              borderTopRadius={10}
              borderTopWidth={1}
              borderColor={AppColors.TEAL}
              borderLeftWidth={1}
              borderRightWidth={1}
              borderBottomRadius={showAddToCalendar ? 0 : 10}
              bg={AppColors.LIGHT_TEAL}
            >
              <View px={3} py={2} bg={AppColors.TEAL} borderTopRadius={10}>
                <Text fontSize={14} fontWeight="semibold" color={"white"}>
                  Your next service on {month} {date}
                </Text>
              </View>
              <HStack
                // borderWidth={1}
                borderColor="white"
                justifyContent={"space-between"}
                p={3}
              >
                <HStack>
                  <VStack pl={3}>
                    <Text
                      fontSize={16}
                      color={AppColors.SECONDARY}
                      fontWeight={"semibold"}
                    >
                      {serviceName} Service
                    </Text>
                    <Text
                      fontSize={14}
                      fontWeight="semibold"
                      color={AppColors.DARK_TEAL}
                    >
                      {day}, {slot}
                    </Text>
                  </VStack>
                </HStack>
                <SvgCss
                  style={{ marginTop: 8 }}
                  xml={CHEVRON_RIGHT_ICON(AppColors.TEAL)}
                />
              </HStack>
            </VStack>
            {showAddToCalendar && (
              <HStack
                borderTopWidth={1}
                borderTopColor={AppColors.EEE}
                borderBottomRadius={10}
                px={4}
                pt={3}
                pb={1}
                borderColor={AppColors.TEAL}
                borderLeftWidth={1}
                borderRightWidth={1}
                borderBottomWidth={1}
                justifyContent="space-between"
                bg={"white"}
              >
                {showAddToCalendar && (
                  <Text
                    fontSize={14}
                    color={AppColors.TEAL}
                    fontWeight={"semibold"}
                    onPress={() => {
                      addToCalendar(serviceName, dateTime);
                    }}
                  >
                    <HStack space={2} alignItems={"center"}>
                      <SvgCss
                        width={15}
                        xml={ADD_CALENDAR_ICON(AppColors.TEAL)}
                      />
                      <Text
                        fontWeight={"bold"}
                        fontSize={14}
                        color={AppColors.TEAL}
                      >
                        Calendar
                      </Text>
                    </HStack>
                  </Text>
                )}
                {showReschedule && (
                  <Text
                    fontSize={14}
                    color={AppColors.TEAL}
                    fontWeight={"semibold"}
                    onPress={() => {
                      setShowRescheduleSheet(true);
                    }}
                  >
                    <HStack space={2} alignItems={"center"}>
                      <SvgCss
                        width={15}
                        xml={ADD_RESCHEDULE_ICON(AppColors.TEAL)}
                      />
                      <Text
                        fontWeight={"bold"}
                        fontSize={14}
                        color={AppColors.TEAL}
                      >
                        Reschedule
                      </Text>
                    </HStack>
                  </Text>
                )}
                {showChat && (
                  <Text
                    fontSize={14}
                    color={AppColors.TEAL}
                    fontWeight={"semibold"}
                    onPress={() => {
                      Linking.openURL(
                        `mailto:support@miohomeservices.com?subject=[${orderId}] Service Notes&body=Hi, \n\n Order ID: ${orderId} \n Service Name: ${serviceName} \n\n Service Note: \n`
                      );
                    }}
                  >
                    <HStack space={2} alignItems={"center"}>
                      <SvgCss width={15} xml={CHAT_ICON(AppColors.TEAL)} />
                      <Text
                        fontWeight={"bold"}
                        fontSize={14}
                        color={AppColors.TEAL}
                      >
                        Note
                      </Text>
                    </HStack>
                  </Text>
                )}
              </HStack>
            )}
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
