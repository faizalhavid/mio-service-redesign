import {
  Actionsheet,
  Center,
  FlatList,
  HStack,
  Pressable,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { AppColors } from "../../commons/colors";
import { OrderStatus, SubOrder } from "../../commons/types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  AppointmentDateOptionType,
  AppointmentTimeOptionType,
  DAY,
  MONTH,
} from "../../screens/Home/ChooseDateTime";
import { SERVICES } from "../../screens/Home/ChooseService";
import { getReadableDateTime } from "../../services/utils";
import {
  getOrderDetailsAsync,
  rescheduleOrderAsync,
  selectOrderDetails,
  selectRescheduleOrder,
} from "../../slices/order-slice";
import { setRefreshNeeded } from "../../slices/shared-slice";
import ErrorView from "../ErrorView";
import FooterButton from "../FooterButton";

type RescheduleProps = {
  isOpen: boolean;
  setOpen: Function;
  orderId: string;
  subOrderId: string;
  dt: string;
};

export const Reschedule = ({
  isOpen,
  setOpen,
  orderId,
  subOrderId,
  dt,
}: RescheduleProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [rescheduleType, setRescheduleType] = useState<"ALL" | "ONCE">("ONCE");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const { member: orderDetail, uiState: orderDetailUiState } =
    useAppSelector(selectOrderDetails);
  const { uiState: rescheduleOrderUiState } = useAppSelector(
    selectRescheduleOrder
  );
  const [errorMsg, setErrorMsg] = useState("");
  const columns = 2;
  const [readableDateTime, setReadableDateTime] = useState("");
  const [appointmentDateOptions, setAppointmentDateOptions] = useState<
    AppointmentDateOptionType[]
  >([]);
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState<
    AppointmentTimeOptionType[]
  >([]);

  useEffect(() => {
    if (orderId && subOrderId) {
      dispatch(getOrderDetailsAsync({ orderId, subOrderId }));
    } else {
      return;
    }
  }, [orderId, subOrderId]);

  React.useEffect(() => {
    if (!orderDetail?.appointmentInfo?.appointmentDateTime) {
      return;
    }
    let dates: AppointmentDateOptionType[] = [];
    [1, 2, 3, 4].forEach((number) => {
      let date = new Date(orderDetail.appointmentInfo.appointmentDateTime);
      date.setDate(date.getDate() + number);
      let month = date.getMonth() + 1;
      let numberDate = date.getDate();
      let fullDate = `${date.getFullYear()}-${
        month > 9 ? month : "0" + month
      }-${numberDate > 9 ? numberDate : "0" + numberDate}`;
      let isSelected = false;

      dates.push({
        fullDate,
        date: date.getDate(),
        day: DAY[date.getDay()],
        month: MONTH[date.getMonth()],
        selected: isSelected,
      });
    });
    setAppointmentDateOptions(dates);
    let times: AppointmentTimeOptionType[] = [];
    [8, 10, 12, 14].forEach((number) => {
      let rangeMin = `${number > 12 ? number - 12 : number}`;
      let actualMin = `${number}`;
      let isSelected = false;
      times.push({
        actualMin,
        rangeMin,
        rangeMax: `${number + 4 > 12 ? number + 4 - 12 : number + 4}`,
        minMeridian: `${number >= 12 ? "PM" : "AM"}`,
        maxMaxidian: `${number + 4 >= 12 ? "PM" : "AM"}`,
        selected: isSelected,
      });
    });
    setAppointmentTimeOptions(times);
  }, [orderDetail]);

  useEffect(() => {
    if (dt) {
      let dateTime = getReadableDateTime(dt);
      setReadableDateTime(
        `${dateTime.month} ${dateTime.date}, ${dateTime.slot}`
      );
    }
  }, [dt]);

  return (
    <>
      <Actionsheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        hideDragIndicator={true}
      >
        <Actionsheet.Content
          style={{
            borderTopLeftRadius: 3,
            borderTopRightRadius: 3,
            paddingTop: 0,
            paddingLeft: 0,
            paddingRight: 0,
            margin: 0,
            backgroundColor: AppColors.EEE,
          }}
        >
          <VStack pt={15} bg={"white"} width="100%">
            <Center>
              <Text fontSize={18} fontWeight="semibold">
                Reschedule
              </Text>
              <Text
                fontSize={14}
                color={AppColors.SECONDARY}
                fontWeight="semibold"
              >
                {SERVICES[orderDetail?.serviceId]?.text} Service
              </Text>
              <Text fontSize={12} color={AppColors.TEAL} fontWeight="semibold">
                {readableDateTime}
              </Text>
            </Center>
            <VStack mt={3} px={4} pb={75} bg={AppColors.EEE}>
              <ErrorView message={errorMsg} />
              <VStack my={3} space={2}>
                <Text
                  fontSize={14}
                  fontWeight={"semibold"}
                  width={"100%"}
                  color={AppColors.SECONDARY}
                >
                  Choose Date
                </Text>
                <HStack
                  justifyContent={"center"}
                  alignContent={"center"}
                  space={0}
                  bg={"#eee"}
                >
                  <FlatList
                    data={appointmentDateOptions}
                    horizontal={true}
                    contentContainerStyle={{
                      width: "100%",
                    }}
                    renderItem={({ index, item }) => (
                      <Pressable
                        key={index}
                        height={20}
                        borderRadius={5}
                        width={78}
                        mr={2}
                        p={2}
                        justifyContent="center"
                        alignItems={"center"}
                        borderWidth={item.selected ? 1 : 0}
                        borderColor={AppColors.TEAL}
                        bg={item.selected ? AppColors.LIGHT_TEAL : "#fff"}
                        _pressed={{
                          borderColor: AppColors.TEAL,
                          borderWidth: 1,
                          backgroundColor: AppColors.LIGHT_TEAL,
                        }}
                        onPress={() => {
                          let updatedAppointmentDateOptions =
                            appointmentDateOptions.map(
                              (option, optionIndex) => {
                                if (optionIndex === index) {
                                  setSelectedDate(option.fullDate);
                                  return {
                                    ...option,
                                    selected: true,
                                  };
                                }
                                return { ...option, selected: false };
                              }
                            );
                          setAppointmentDateOptions(
                            updatedAppointmentDateOptions
                          );
                        }}
                      >
                        <Text
                          alignSelf={"center"}
                          color={AppColors.TEAL}
                          fontWeight={"semibold"}
                          textAlign="center"
                        >
                          {item.day} {"\n"} {item.month} {item.date}
                        </Text>
                      </Pressable>
                    )}
                  />
                </HStack>
                <Text
                  fontSize={14}
                  fontWeight={"semibold"}
                  width={"100%"}
                  color={AppColors.SECONDARY}
                >
                  Choose Slot
                </Text>
                <HStack
                  justifyContent={"center"}
                  alignItems={"center"}
                  space={0}
                  bg={"#eee"}
                >
                  <FlatList
                    data={appointmentTimeOptions}
                    numColumns={columns}
                    contentContainerStyle={{
                      alignSelf: "center",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                    renderItem={({ index, item }) => (
                      <Pressable
                        key={index}
                        height={10}
                        borderRadius={5}
                        width={"48%"}
                        m={1}
                        justifyContent="center"
                        p={2}
                        borderWidth={item.selected ? 1 : 0}
                        borderColor={AppColors.TEAL}
                        bg={item.selected ? AppColors.LIGHT_TEAL : "#fff"}
                        _pressed={{
                          borderColor: AppColors.TEAL,
                          borderWidth: 1,
                          backgroundColor: AppColors.LIGHT_TEAL,
                        }}
                        onPress={() => {
                          let updatedAppointmentTimeOptions =
                            appointmentTimeOptions.map(
                              (option, optionIndex) => {
                                if (optionIndex === index) {
                                  setSelectedTime(option.actualMin);
                                  return {
                                    ...option,
                                    selected: true,
                                  };
                                }
                                return { ...option, selected: false };
                              }
                            );
                          setAppointmentTimeOptions(
                            updatedAppointmentTimeOptions
                          );
                        }}
                      >
                        <Text
                          alignSelf={"center"}
                          color={AppColors.TEAL}
                          fontWeight={"semibold"}
                        >
                          {`${item.rangeMin} ${item.minMeridian} - ${item.rangeMax} ${item.maxMaxidian}`}
                        </Text>
                      </Pressable>
                    )}
                  />
                </HStack>
                <Text
                  fontSize={14}
                  fontWeight={"semibold"}
                  width={"100%"}
                  color={AppColors.SECONDARY}
                >
                  Reschedule Type
                </Text>
                {orderDetail?.flags?.recurringDuration === "ONCE" ? (
                  <Pressable
                    key={"TYPE_1"}
                    borderRadius={5}
                    width={"100%"}
                    px={3}
                    py={3}
                    justifyContent="center"
                    borderWidth={rescheduleType === "ONCE" ? 1 : 0}
                    borderColor={AppColors.TEAL}
                    bg={
                      rescheduleType === "ONCE" ? AppColors.LIGHT_TEAL : "#fff"
                    }
                    _pressed={{
                      borderColor: AppColors.TEAL,
                      borderWidth: 1,
                      backgroundColor: AppColors.LIGHT_TEAL,
                    }}
                    onPress={() => {}}
                  >
                    <VStack>
                      <Text color={AppColors.TEAL} fontWeight={"semibold"}>
                        Reschedule Current Order
                      </Text>
                      <Text
                        fontSize={12}
                        color={"amber.600"}
                        fontWeight={"semibold"}
                      >
                        This action will reschedule the current scheduled order.
                      </Text>
                    </VStack>
                  </Pressable>
                ) : (
                  <>
                    <Pressable
                      key={"TYPE_1"}
                      borderRadius={5}
                      width={"100%"}
                      px={3}
                      py={3}
                      justifyContent="center"
                      borderWidth={rescheduleType === "ONCE" ? 1 : 0}
                      borderColor={AppColors.TEAL}
                      bg={
                        rescheduleType === "ONCE"
                          ? AppColors.LIGHT_TEAL
                          : "#fff"
                      }
                      _pressed={{
                        borderColor: AppColors.TEAL,
                        borderWidth: 1,
                        backgroundColor: AppColors.LIGHT_TEAL,
                      }}
                      onPress={() => {
                        setRescheduleType("ONCE");
                      }}
                    >
                      <VStack>
                        <Text color={AppColors.TEAL} fontWeight={"semibold"}>
                          Reschedule Current Order
                        </Text>
                        <Text
                          fontSize={12}
                          color={"amber.600"}
                          fontWeight={"semibold"}
                        >
                          This action will reschedule the current scheduled
                          order.
                        </Text>
                      </VStack>
                    </Pressable>
                    <Pressable
                      key={"TYPE_2"}
                      borderRadius={5}
                      width={"100%"}
                      px={3}
                      py={3}
                      justifyContent="center"
                      borderWidth={rescheduleType === "ALL" ? 1 : 0}
                      borderColor={AppColors.TEAL}
                      bg={
                        rescheduleType === "ALL" ? AppColors.LIGHT_TEAL : "#fff"
                      }
                      _pressed={{
                        borderColor: AppColors.TEAL,
                        borderWidth: 1,
                        backgroundColor: AppColors.LIGHT_TEAL,
                      }}
                      onPress={() => {
                        setRescheduleType("ALL");
                      }}
                    >
                      <VStack>
                        <Text color={AppColors.TEAL} fontWeight={"semibold"}>
                          Reschedule All Upcoming Orders
                        </Text>
                        <Text
                          fontSize={12}
                          color={"amber.600"}
                          fontWeight={"semibold"}
                        >
                          This action will reschedule all the upcoming orders.
                        </Text>
                      </VStack>
                    </Pressable>
                  </>
                )}
              </VStack>
            </VStack>
            <FooterButton
              disabled={!selectedDate || !selectedTime}
              loading={
                orderDetailUiState === "IN_PROGRESS" ||
                rescheduleOrderUiState === "IN_PROGRESS"
              }
              label="RESCHEDULE"
              type="DEFAULT"
              onPress={() => {
                let selecDate = selectedDate;
                if (Platform.OS === "ios") {
                  selecDate = selecDate.replace(/-/g, "/");
                }
                dispatch(
                  rescheduleOrderAsync({
                    type: rescheduleType,
                    orderId: orderId,
                    subOrderId: orderDetail.subOrderId,
                    dateTime: new Date(
                      `${selecDate} ${
                        parseInt(selectedTime) > 9
                          ? selectedTime
                          : "0" + selectedTime
                      }:00:00`
                    ).toISOString(),
                  })
                ).then((response) => {
                  let result: OrderStatus = response.payload;
                  if (result.status === "SUCCESS") {
                    setOpen(false);
                    dispatch(
                      setRefreshNeeded({ data: { UPCOMING_SERVICES: true } })
                    );
                  } else {
                    setErrorMsg(result.message);
                  }
                });
              }}
            />
          </VStack>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};
