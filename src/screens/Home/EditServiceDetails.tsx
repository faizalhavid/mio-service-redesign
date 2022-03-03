import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  VStack,
  Text,
  HStack,
  Divider,
  TextArea,
  PresenceTransition,
  View,
} from "native-base";
import React, { useState } from "react";
import { Dimensions, Platform, ScrollView } from "react-native";
import { SvgCss } from "react-native-svg";
import { useMutation } from "react-query";
import { AppColors } from "../../commons/colors";
import { PriceMap, SubOrder } from "../../commons/types";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import SelectionButton from "../../components/SelectionButton";
import { useAuth } from "../../contexts/AuthContext";
import { SuperRootStackParamList } from "../../navigations";
import { goBack } from "../../navigations/rootNavigation";
import { getServiceCost, putLead } from "../../services/order";
import { HOUSE_CLEANING_ID, LAWN_CARE_ID, SERVICES } from "./ChooseService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ErrorView from "../../components/ErrorView";

type LawnSizeType = {
  rangeMin: number | null;
  rangeMax: number | null;
  selected: boolean;
};

type PriceListType = {
  cost: number;
  monthlyCost?: number;
  frequency: string | number;
  selected: boolean;
  position: number;
};

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

type EditServiceDetailsProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "EditServiceDetails"
>;

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

const EditServiceDetails = ({
  route,
}: EditServiceDetailsProps): JSX.Element => {
  const { serviceId, mode } = route.params;

  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [serviceNotes, setServiceNotes] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] =
    React.useState<any>({});

  const { leadDetails, setLeadDetails, customerProfile } = useAuth();

  const screenWidth = Dimensions.get("screen").width;

  const [groupedLeadDetails, setGroupedLeadDetails] = useState<{
    [key: string]: SubOrder;
  }>({});

  React.useEffect(() => {
    if (!leadDetails) {
      return;
    }
    let details: { [key: string]: SubOrder } = {};
    leadDetails.subOrders.forEach((subOrder) => {
      details[subOrder.serviceId] = subOrder;
    });

    setGroupedLeadDetails(details);
  }, [leadDetails]);

  const updateLeadMutation = useMutation(
    "updateLead",
    () => {
      setLoading(true);
      let updatedSuborders = leadDetails.subOrders.map((subOrder) => {
        if (subOrder.serviceId === serviceId) {
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

          if (selectedSubscriptionMethod.method === "RECURRING") {
            subOrder.servicePrice.cost =
              selectedSubscriptionMethod?.activeOption?.perCost;
            subOrder.flags.recurringDuration =
              selectedSubscriptionMethod?.activeOption?.type;
            subOrder.flags.isRecurring = true;
          } else {
            subOrder.servicePrice.cost = selectedSubscriptionMethod.cost;
            subOrder.flags.recurringDuration = "ONCE";
            subOrder.flags.isRecurring = false;
          }

          return subOrder;
        }
        return subOrder;
      });
      let payload = {
        ...leadDetails,
        subOrders: updatedSuborders,
      };
      return putLead(payload);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setLeadDetails(data.data);
        goBack();
      },
      onError: (err) => {
        setErrorMsg("Something went wrong!");
        setLoading(false);
        console.log(err);
      },
    }
  );

  const [showFields, setShowFields] = React.useState(false);

  const updateShowFields = React.useCallback(async () => {
    setTimeout(() => {
      setShowFields(true);
    }, 0);
  }, []);

  React.useEffect(() => {
    updateShowFields();
  }, [updateShowFields]);

  const [subscriptionMethodOptions, setSubscriptionMethodOptions] =
    React.useState<any[]>([]);
  const getServiceCostMutation = useMutation(
    "getServiceCost",
    (payload: any) => {
      setLoading(true);
      return getServiceCost(payload);
    },
    {
      onSuccess: (data) => {
        let isUpdate = mode === "UPDATE";
        let subOrder = groupedLeadDetails[serviceId];
        let subscriptionMethods: any[] = [];
        let recurringOptions: any[] = [];
        let priceMap: PriceMap[] = data.data;
        let pricePerMonth = "";
        if (priceMap && priceMap[0]) {
          let pricePerWeekExists =
            priceMap[0].pricePerWeek &&
            parseInt(priceMap[0].pricePerWeek) !== 0;
          let pricePer2WeeksExists =
            priceMap[0].pricePer2Weeks &&
            parseInt(priceMap[0].pricePer2Weeks) !== 0;
          let pricePerMonthExists =
            priceMap[0].pricePerMonth &&
            parseInt(priceMap[0].pricePerMonth) !== 0;

          if (pricePerWeekExists) {
            recurringOptions.push({
              perCost: priceMap[0].pricePerWeek,
              type: "WEEKLY",
              label: "Weekly",
              selected: false,
            });
          }
          if (pricePer2WeeksExists) {
            recurringOptions.push({
              perCost: priceMap[0].pricePer2Weeks,
              type: "BIWEEKLY",
              label: "Bi-Weekly",
              selected: false,
            });
          }
          if (pricePerMonthExists) {
            pricePerMonth = priceMap[0].pricePerMonth;
            recurringOptions.push({
              perCost: pricePerMonth,
              type: "MONTHLY",
              label: "Monthly",
              selected: false,
            });
          }
          if (
            pricePerWeekExists ||
            pricePer2WeeksExists ||
            pricePerMonthExists
          ) {
            if (isUpdate) {
              let selectedIndex: number = 0;
              for (let i = 0; i < recurringOptions.length; i++) {
                if (
                  recurringOptions[i].type ===
                  subOrder?.flags?.recurringDuration
                ) {
                  selectedIndex = i;
                }
              }
              recurringOptions[selectedIndex] = {
                ...recurringOptions[selectedIndex],
                selected: true,
              };
              let sub = {
                method: "RECURRING",
                label: `$${pricePerMonth} Billed Monthly`,
                selected: subOrder?.flags.isRecurring,
                activeOption: recurringOptions[selectedIndex],
                options: recurringOptions,
              };
              subscriptionMethods.push(sub);
              setSelectedSubscriptionMethod(sub);
            } else {
              recurringOptions[0] = {
                ...recurringOptions[0],
                selected: true,
              };
              let sub = {
                method: "RECURRING",
                label: `$${pricePerMonth} Billed Monthly`,
                selected: true,
                activeOption: recurringOptions[0],
                options: recurringOptions,
              };
              subscriptionMethods.push(sub);
              setSelectedSubscriptionMethod(sub);
            }
          }

          if (
            priceMap[0].pricePerOnetime &&
            parseInt(priceMap[0].pricePerOnetime) !== 0
          ) {
            let sub = {
              method: "ONCE",
              cost: priceMap[0].pricePerOnetime,
              label: "One-time Service",
              selected: isUpdate
                ? subOrder?.flags.isRecurring
                  ? false
                  : true
                : false,
            };
            subscriptionMethods.push(sub);
            if (isUpdate && !subOrder.flags.isRecurring) {
              setSelectedSubscriptionMethod(sub);
            }
          }
        }
        setSubscriptionMethodOptions(subscriptionMethods);
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  React.useEffect(() => {
    if (
      Object.keys(customerProfile).length === 0 ||
      Object.keys(groupedLeadDetails).length === 0
    ) {
      return;
    }
    if (serviceId) {
      setLoading(true);
      for (let subOrder of leadDetails.subOrders) {
        if (
          subOrder.serviceId === serviceId &&
          serviceId === LAWN_CARE_ID &&
          subOrder.area
        ) {
          let lotsize: number = parseInt(subOrder.area);
          getServiceCostMutation.mutate([
            {
              serviceId,
              serviceParameters: {
                area: lotsize,
              },
            },
          ]);
          break;
        } else if (
          subOrder.serviceId === serviceId &&
          serviceId === HOUSE_CLEANING_ID &&
          subOrder.bathrooms &&
          subOrder.bedrooms
        ) {
          getServiceCostMutation.mutate([
            {
              serviceId,
              serviceParameters: {
                bedrooms: parseInt(subOrder.bedrooms),
                bathrooms: parseInt(subOrder.bathrooms),
              },
            },
          ]);
          break;
        } else if (["pestControl", "poolCleaning"].includes(serviceId)) {
          getServiceCostMutation.mutate([
            {
              serviceId,
              serviceParameters: {},
            },
          ]);
          break;
        }
      }
      setLoading(false);
    }
    return;
  }, [serviceId, customerProfile, groupedLeadDetails]);

  const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [appointmentDateOptions, setAppointmentDateOptions] =
    useState<AppointmentDateOptionType[]>();

  const [appointmentTimeOptions, setAppointmentTimeOptions] =
    useState<AppointmentTimeOptionType[]>();

  React.useEffect(() => {
    if (
      !mode ||
      !groupedLeadDetails ||
      Object.keys(groupedLeadDetails).length === 0
    ) {
      return;
    }
    let isUpdate = mode === "UPDATE";

    let subOrder = groupedLeadDetails[serviceId];
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
  }, [groupedLeadDetails, mode]);

  const Title = (text: string) => {
    return (
      <Text
        fontSize={14}
        fontWeight={"semibold"}
        width={"100%"}
        color={AppColors.SECONDARY}
      >
        {text}
      </Text>
    );
  };

  const SectionDivider = (t: number) => {
    return <Divider thickness={t} mt={4}></Divider>;
  };

  return (
    <AppSafeAreaView loading={loading}>
      {showFields && serviceId && (
        <PresenceTransition
          visible={true}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 150,
            },
          }}
        >
          <VStack paddingX={5}>
            <KeyboardAwareScrollView enableOnAndroid={true}>
              <ScrollView>
                <Divider thickness={0}></Divider>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                  <Text
                    fontSize={20}
                    fontWeight={"semibold"}
                    color={AppColors.DARK_PRIMARY}
                  >
                    {SERVICES[serviceId].text}
                  </Text>
                  <SvgCss
                    xml={SERVICES[serviceId].icon(AppColors.DARK_PRIMARY)}
                    width={25}
                    height={25}
                  />
                </HStack>
                {SectionDivider(1)}
                <VStack>
                  <ErrorView message={errorMsg} />
                  {SectionDivider(0)}
                  {Title("Choose Subscription Method")}
                  {SectionDivider(0)}
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <VStack>
                      <HStack space={2}>
                        {subscriptionMethodOptions.length > 0 &&
                          subscriptionMethodOptions.map((sub, index) => {
                            return (
                              <SelectionButton
                                w={(screenWidth - 60) / 2}
                                h={90}
                                variant="custom"
                                active={sub.selected}
                                index={index}
                                key={index}
                                onPress={(index1) => {
                                  let updatedOptions =
                                    subscriptionMethodOptions.map((opt, i) => {
                                      if (i === index1) {
                                        setSelectedSubscriptionMethod(opt);
                                        return {
                                          ...opt,
                                          selected: true,
                                        };
                                      }
                                      return {
                                        ...opt,
                                        selected: false,
                                      };
                                    });
                                  setSubscriptionMethodOptions(updatedOptions);
                                }}
                                text2={(color) => {
                                  if (sub.method === "RECURRING") {
                                    return (
                                      <VStack space={1} justifyContent="center">
                                        <HStack
                                          space={2}
                                          justifyContent="center"
                                          alignItems={"center"}
                                        >
                                          <Text fontSize={30} color={color}>
                                            ${sub.activeOption?.perCost}
                                          </Text>
                                          <Text fontSize={12} color={color}>
                                            / {sub.activeOption?.label}
                                          </Text>
                                        </HStack>
                                        <Text
                                          textAlign={"center"}
                                          fontSize={12}
                                          color={color}
                                        >
                                          {sub.label}
                                        </Text>
                                      </VStack>
                                    );
                                  } else {
                                    return (
                                      <VStack
                                        space={1}
                                        justifyContent="center"
                                        alignItems={"center"}
                                      >
                                        <Text fontSize={30} color={color}>
                                          ${sub.cost}
                                        </Text>

                                        <Text
                                          textAlign={"center"}
                                          fontSize={12}
                                          color={color}
                                        >
                                          {sub.label}
                                        </Text>
                                      </VStack>
                                    );
                                  }
                                }}
                              />
                            );
                          })}
                      </HStack>
                      {subscriptionMethodOptions.length > 0 &&
                        subscriptionMethodOptions[0].selected === true &&
                        subscriptionMethodOptions[0].method === "RECURRING" && (
                          <>
                            {SectionDivider(0)}
                            <HStack
                              space={2}
                              maxWidth={screenWidth - 40}
                              flexWrap={"wrap"}
                              flexDirection="row"
                            >
                              {subscriptionMethodOptions[0].options.map(
                                (option: any, index: number) => {
                                  return (
                                    <SelectionButton
                                      key={index}
                                      w={(screenWidth - 60) / 3.07}
                                      active={option.selected}
                                      text={option.label}
                                      onPress={(index: number) => {
                                        let activeOption = {};
                                        let updatedOptions =
                                          subscriptionMethodOptions[0].options.map(
                                            (opt: any, i: number) => {
                                              if (i === index) {
                                                activeOption = {
                                                  ...opt,
                                                  selected: true,
                                                };
                                                return activeOption;
                                              }
                                              return {
                                                ...opt,
                                                selected: false,
                                              };
                                            }
                                          );
                                        let updatedRecurringSubscriptionOption =
                                          {
                                            ...subscriptionMethodOptions[0],
                                            activeOption,
                                            options: updatedOptions,
                                          };
                                        setSubscriptionMethodOptions([
                                          updatedRecurringSubscriptionOption,
                                          subscriptionMethodOptions[1],
                                        ]);
                                        setSelectedSubscriptionMethod(
                                          updatedRecurringSubscriptionOption
                                        );
                                      }}
                                      index={index}
                                    />
                                  );
                                }
                              )}
                            </HStack>
                          </>
                        )}
                    </VStack>
                  </ScrollView>
                  {SectionDivider(0)}
                  {Title("Choose Date")}
                  {SectionDivider(0)}
                  <HStack space={2}>
                    {appointmentDateOptions?.map((option, index) => {
                      return (
                        <SelectionButton
                          key={index}
                          w={(screenWidth - 60) / 4.2}
                          h={75}
                          variant="custom"
                          active={option.selected}
                          text2={(color) => {
                            return (
                              <VStack
                                justifyContent={"center"}
                                alignItems={"center"}
                              >
                                <Text color={color}>{option.day}</Text>
                                <Text color={color}>
                                  {option.month} {option.date}
                                </Text>
                              </VStack>
                            );
                          }}
                          onPress={function (index: number): void {
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
                          index={index}
                        />
                      );
                    })}
                  </HStack>
                  {SectionDivider(0)}
                  {Title("Choose Timeslot")}
                  {SectionDivider(0)}
                  <VStack space={2}>
                    <HStack
                      space={2}
                      maxWidth={screenWidth - 40}
                      flexWrap={"wrap"}
                      flexDirection="row"
                    >
                      {appointmentTimeOptions?.map((timeslot, index) => {
                        return (
                          <View mb={1} key={index}>
                            <SelectionButton
                              w={(screenWidth - 60) / 2}
                              active={timeslot.selected}
                              text={`${timeslot.rangeMin} ${timeslot.minMeridian} - ${timeslot.rangeMax} ${timeslot.maxMaxidian}`}
                              onPress={function (index: number): void {
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
                              index={index}
                            />
                          </View>
                        );
                      })}
                    </HStack>
                    {SectionDivider(0)}
                    {Title("Add Service Note")}
                    <Divider thickness={0} mt={1}></Divider>
                    <TextArea
                      onChangeText={(text) => {
                        setServiceNotes(text);
                      }}
                      fontSize={14}
                      value={serviceNotes}
                      keyboardType="default"
                      numberOfLines={5}
                      mb={20}
                    />
                    <Divider thickness={0} mt={250}></Divider>
                  </VStack>
                </VStack>
              </ScrollView>
            </KeyboardAwareScrollView>
          </VStack>
        </PresenceTransition>
      )}
      <FooterButton
        disabled={
          !selectedDate ||
          !selectedTime ||
          Object.keys(selectedSubscriptionMethod).length === 0
        }
        subText="Choose Subscription Method & Schedule"
        label="SAVE"
        onPress={async () => {
          await updateLeadMutation.mutateAsync();
        }}
      />
    </AppSafeAreaView>
  );
};

export default EditServiceDetails;
