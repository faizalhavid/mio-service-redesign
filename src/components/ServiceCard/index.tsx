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
import React, { memo } from "react";
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
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { navigate } from "../../navigations/rootNavigation";
import { addToCalendar } from "../../services/calendar";
import { resetOrderDetails } from "../../slices/order-slice";
import { Reschedule } from "../Reschedule";

type ServiceCardProps = {
  variant: "solid" | "outline";
  showWelcomeMessage?: boolean;
  showAddToCalendar?: boolean;
  showReschedule?: boolean;
  showChat?: boolean;
  w?: string;
  status?: string;
  dateTime: string;
  serviceName: string;
  date: string;
  day: string;
  month?: string;
  type?: string;
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
  status,
  serviceName,
  date,
  day,
  month,
  type = "UPCOMING",
  slot,
  year,
  orderId,
  subOrderId,
}: ServiceCardProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const outlineColor = AppColors.TEAL;
  const isOutline = variant === "outline";
  const borderWidth = isOutline ? 1 : 0;
  const bg = isOutline ? "#fff" : outlineColor;
  const textColor = isOutline ? outlineColor : "#fff";
  const width = w || (isOutline ? 300 : "100%");
  const [showRescheduleSheet, setShowRescheduleSheet] =
    React.useState<boolean>(false);

  const CardActions = () => {
    return (
      <>
        {showAddToCalendar && (
          <HStack
            borderBottomRadius={10}
            px={4}
            pt={2}
            pb={2}
            borderTopColor={isOutline ? AppColors.EEE : "white"}
            borderColor={isOutline ? AppColors.EEE : AppColors.TEAL}
            borderTopWidth={1}
            borderLeftWidth={isOutline ? 0 : 1}
            borderRightWidth={isOutline ? 0 : 1}
            borderBottomWidth={isOutline ? 0 : 1}
            justifyContent="space-between"
            bg={"white"}
          >
            {showAddToCalendar && (
              <Pressable
                fontSize={14}
                color={AppColors.TEAL}
                fontWeight={"semibold"}
                // justifyContent={"center"}
                // alignItems="center"
                onPress={() => {
                  addToCalendar(serviceName, dateTime);
                }}
              >
                <HStack space={2}>
                  <SvgCss width={15} xml={ADD_CALENDAR_ICON(AppColors.TEAL)} />
                  <Text
                    alignSelf={"center"}
                    fontWeight={"bold"}
                    fontSize={14}
                    color={AppColors.TEAL}
                  >
                    Calendar
                  </Text>
                </HStack>
              </Pressable>
            )}
            {showReschedule && (
              <Pressable
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
              </Pressable>
            )}
            {showChat && (
              <Pressable
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
              </Pressable>
            )}
          </HStack>
        )}
      </>
    );
  };

  return (
    <Pressable
      onPress={() => {
        dispatch(resetOrderDetails());
        navigate("ViewServiceDetails", { orderId, subOrderId });
      }}
    >
      <VStack>
        {isOutline ? (
          <>
            <HStack
              key={Math.random()}
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
                  bg={
                    status === "CANCELED"
                      ? "red.100"
                      : type === "UPCOMING"
                      ? AppColors.LIGHT_TEAL
                      : AppColors.EEE
                  }
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
                    {serviceName} Service{" "}
                    {status === "CANCELED" ? (
                      <Text fontSize={12} color={"red.700"}>
                        CANCELED
                      </Text>
                    ) : (
                      ""
                    )}
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
            {CardActions()}
          </>
        ) : (
          <>
            <VStack
              key={Math.random()}
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
            {CardActions()}
          </>
        )}
      </VStack>
      {showRescheduleSheet && (
        <Reschedule
          isOpen={showRescheduleSheet}
          setOpen={setShowRescheduleSheet}
          orderId={orderId}
          subOrderId={subOrderId}
          dt={dateTime}
        />
      )}
    </Pressable>
  );
};

export default memo(ServiceCard);
