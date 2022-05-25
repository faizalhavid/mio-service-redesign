import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  FlatList,
  HStack,
  Pressable,
  Text,
  TextArea,
  VStack,
} from "native-base";
import { mode } from "native-base/lib/typescript/theme/tools";
import React, { useState } from "react";
import { Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../commons/colors";
import { LeadDetails, SubOrder } from "../../commons/types";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import VirtualizedView from "../../components/VirtualizedView";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { SuperRootStackParamList } from "../../navigations";
import { goBack } from "../../navigations/rootNavigation";
import { deepClone } from "../../services/utils";
import { selectLead, updateLeadAsync } from "../../slices/lead-slice";
import { selectSelectedServices } from "../../slices/service-slice";

type AppointmentDateOptionType = {
  fullDate: string;
  date: number;
  day: string;
  month: string;
  selected: boolean;
};

type AppointmentTimeOptionType = {
  actualMin: string;
  rangeMin: string;
  rangeMax: string;
  minMeridian: string;
  maxMaxidian: string;
  selected: boolean;
};

export const MONTH = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sept",
  "Oct",
  "Nov",
  "Dec",
];

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type ChooseDateTimeProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "ChooseDateTime"
>;

const ChooseDateTime = ({ route }: ChooseDateTimeProps): JSX.Element => {
  const columns = 2;
  const dispatch = useAppDispatch();
  const { mode } = route.params;
  const [serviceNotes, setServiceNotes] = React.useState<string>("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [appointmentDateOptions, setAppointmentDateOptions] = useState<
    AppointmentDateOptionType[]
  >([]);
  const [appointmentTimeOptions, setAppointmentTimeOptions] = useState<
    AppointmentTimeOptionType[]
  >([]);
  const { member: selectedService } = useAppSelector(selectSelectedServices);
  const { member: leadDetails, uiState: leadDetailsUiState } =
    useAppSelector(selectLead);

  const updateLead = async () => {
    let _leadDetails: LeadDetails = deepClone(leadDetails);
    let updatedSuborders = _leadDetails.subOrders.map((subOrder) => {
      if (subOrder.serviceId === selectedService) {
        let selecDate = selectedDate;
        if (Platform.OS === "ios") {
          selecDate = selecDate.replace(/-/g, "/");
        }
        subOrder.appointmentInfo.appointmentDateTime = new Date(
          `${selecDate} ${
            parseInt(selectedTime) > 9 ? selectedTime : "0" + selectedTime
          }:00:00`
        ).toISOString();
        subOrder.appointmentInfo.providerProfile.eaProviderId = 2;
        subOrder.serviceNotes = [serviceNotes];

        if (appointmentTimeOptions) {
          for (let option of appointmentTimeOptions) {
            if (option.selected) {
              subOrder.appointmentInfo.selectedRange = {
                rangeStart: `${option.rangeMin} ${option.minMeridian}`,
                rangeEnd: `${option.rangeMax} ${option.maxMaxidian}`,
              };
            }
          }
        }
      }
      return subOrder;
    });
    let payload = {
      ..._leadDetails,
      subOrders: updatedSuborders,
    };

    return dispatch(updateLeadAsync(payload));
    // return putLead(payload);
  };

  React.useEffect(() => {
    let isUpdate = mode === "UPDATE";
    let subOrder = {} as SubOrder;
    if (isUpdate) {
      subOrder = leadDetails.subOrders.filter(
        (so) => so.serviceId === selectedService
      )[0];
    }
    if (isUpdate) {
      setServiceNotes(subOrder?.serviceNotes[0] || "");
    }

    let dates: AppointmentDateOptionType[] = [];
    [7, 8, 9, 10].forEach((number) => {
      let date = new Date();
      date.setDate(date.getDate() + number);
      let month = date.getMonth() + 1;
      let numberDate = date.getDate();
      let fullDate = `${date.getFullYear()}-${
        month > 9 ? month : "0" + month
      }-${numberDate > 9 ? numberDate : "0" + numberDate}`;
      let isSelected = false;
      if (isUpdate) {
        isSelected =
          date.getDate() ===
          new Date(subOrder.appointmentInfo.appointmentDateTime).getDate();
        if (isSelected) {
          setSelectedDate(fullDate);
        }
      }
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
      if (isUpdate) {
        isSelected =
          parseInt(actualMin) ===
          new Date(subOrder.appointmentInfo.appointmentDateTime).getHours();
        if (isSelected) {
          setSelectedTime(actualMin);
        }
      }
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
  }, [mode]);

  return (
    <AppSafeAreaView loading={leadDetailsUiState === "IN_PROGRESS"}>
      <VirtualizedView>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <VStack mt={"1/5"} space={5}>
            <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
              Choose Date
            </Text>
            <HStack
              justifyContent={"center"}
              alignContent={"center"}
              space={0}
              bg={"#eee"}
              p={3}
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
                        appointmentDateOptions.map((option, optionIndex) => {
                          if (optionIndex === index) {
                            setSelectedDate(option.fullDate);
                            return {
                              ...option,
                              selected: true,
                            };
                          }
                          return { ...option, selected: false };
                        });
                      setAppointmentDateOptions(updatedAppointmentDateOptions);
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
            <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
              Choose Slot
            </Text>
            <HStack
              justifyContent={"center"}
              alignItems={"center"}
              space={0}
              bg={"#eee"}
              p={3}
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
                        appointmentTimeOptions.map((option, optionIndex) => {
                          if (optionIndex === index) {
                            setSelectedTime(option.actualMin);
                            return {
                              ...option,
                              selected: true,
                            };
                          }
                          return { ...option, selected: false };
                        });
                      setAppointmentTimeOptions(updatedAppointmentTimeOptions);
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
            <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
              Service Notes{" "}
              <Text color={AppColors.AAA} fontSize={14}>
                (Optional)
              </Text>
            </Text>
            <TextArea
              mx={3}
              onChangeText={(text): void => {
                setServiceNotes(text);
              }}
              fontSize={14}
              value={serviceNotes}
              numberOfLines={5}
              mb={100}
            />
          </VStack>
        </KeyboardAwareScrollView>
      </VirtualizedView>
      <FooterButton
        type="DATETIME_SELECTION"
        label="DONE"
        disabled={!selectedDate || !selectedTime}
        loading={leadDetailsUiState === "IN_PROGRESS"}
        onPress={async () => {
          await updateLead();
          goBack();
        }}
      />
    </AppSafeAreaView>
  );
};

export default ChooseDateTime;