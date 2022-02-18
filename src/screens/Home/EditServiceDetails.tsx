import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  VStack,
  Text,
  HStack,
  Divider,
  TextArea,
  PresenceTransition,
  Flex,
  View,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, KeyboardAvoidingView, ScrollView } from "react-native";
import { SvgCss } from "react-native-svg";
import { useMutation, useQuery } from "react-query";
import { LAWN_CARE } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import { PriceMap, Service, SubOrder } from "../../commons/types";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import SelectionButton from "../../components/SelectionButton";
import { CustomerProfile, useAuth } from "../../contexts/AuthContext";
import { SuperRootStackParamList } from "../../navigations";
import { goBack } from "../../navigations/rootNavigation";
import { getServiceCost, getServices, putLead } from "../../services/order";
import { SERVICES } from "./ChooseService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCustomer } from "../../services/customer";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

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
  rangeMin: string;
  rangeMax: string;
  minMeridian: string;
  maxMaxidian: string;
  selected: boolean;
};

type BathBedOptions = { number: number; selected: boolean };

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
  const { serviceId } = route.params;

  const [loading, setLoading] = React.useState(false);

  const [serviceNotes, setServiceNotes] = React.useState("");
  const [selectedDate, setSelectedDate] = React.useState("");
  const [selectedTime, setSelectedTime] = React.useState("");
  const [selectedArea, setSelectedArea] = React.useState<number>();
  const [selectedBathroomNo, setSelectedBathroomNo] = React.useState<number>();
  const [selectedBedroomNo, setSelectedBedroomNo] = React.useState<number>();
  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] =
    React.useState<any>({});

  const { leadDetails, setLeadDetails } = useAuth();

  const [customerProfile, setCustomerProfile] = React.useState<CustomerProfile>(
    {} as CustomerProfile
  );

  const [services, setServices] = React.useState<Service[]>([{} as Service]);

  const screenWidth = Dimensions.get("screen").width;

  const getAllServices = useQuery(
    "getAllServices",
    () => {
      setLoading(true);
      return getServices();
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setServices(data.data);
      },
      onError: (err) => {
        setLoading(false);
        console.log(err);
      },
    }
  );

  const [customerId, setCustomerId] = React.useState<string | null>(null);
  const fetchCustomerProfile = useCallback(async () => {
    let cId = await AsyncStorage.getItem("CUSTOMER_ID");
    setCustomerId(cId);
    await getCustomerMutation.mutateAsync();
  }, []);

  useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

  const [bathroomOptions, setBathroomOptions] = React.useState<
    BathBedOptions[]
  >([]);
  const [bedroomOptions, setBedroomOptions] = React.useState<BathBedOptions[]>(
    []
  );

  const getCustomerMutation = useMutation(
    "getCustomer",
    () => {
      setLoading(true);
      return getCustomer(customerId);
    },
    {
      onSuccess: (data) => {
        setCustomerProfile(data.data);
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const updateLeadMutation = useMutation(
    "updateLead",
    () => {
      setLoading(true);
      let selectedSubOrder: SubOrder = {} as SubOrder;
      let updatedSuborders = leadDetails.subOrders.map((subOrder) => {
        if (subOrder.serviceId === serviceId) {
          selectedSubOrder = subOrder;
          subOrder.appointmentInfo.appointmentDateTime = new Date(
            `${selectedDate} ${selectedTime}:00:00`
          ).toISOString();
          if (serviceId === "lawnCare") {
            subOrder.area = String(selectedArea);
          }
          if (serviceId === "houseCleaning") {
            subOrder.bedrooms = String(selectedBedroomNo);
            subOrder.bathrooms = String(selectedBathroomNo);
          }
          subOrder.appointmentInfo.providerProfile.eaProviderId = 2;
          subOrder.serviceNotes = [serviceNotes];

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
      },
      onError: (err) => {
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

  const [priceMap, setPriceMap] = React.useState<PriceMap[]>([]);

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

          if (
            priceMap[0].pricePerOnetime &&
            parseInt(priceMap[0].pricePerOnetime) !== 0
          ) {
            subscriptionMethods.push({
              method: "ONCE",
              cost: priceMap[0].pricePerOnetime,
              label: "One-time Service",
              selected: false,
            });
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
    if (Object.keys(customerProfile).length === 0) {
      return;
    }
    if (serviceId && services) {
      setLoading(true);
      services.forEach((service) => {
        if (
          ["lawnCare"].includes(serviceId) &&
          service.serviceId === serviceId
        ) {
          if (customerProfile.addresses[0].houseInfo?.lotSize) {
            let priceMap: PriceMap[] = [];
            let lotsize: number = parseInt(
              customerProfile.addresses[0].houseInfo?.lotSize
            );
            service.priceMap.forEach((price) => {
              if (serviceId === "lawnCare") {
                if (
                  price.rangeMin &&
                  price.rangeMax &&
                  lotsize &&
                  lotsize > price.rangeMin &&
                  lotsize < price.rangeMax
                ) {
                  setSelectedArea(lotsize);
                  priceMap.push({
                    ...price,
                    selected: true,
                  });
                  getServiceCostMutation.mutate([
                    {
                      serviceId,
                      serviceParameters: {
                        area: lotsize,
                      },
                    },
                  ]);
                } else {
                  priceMap.push(price);
                }
              }
            });
            setPriceMap(priceMap);
          } else {
            setPriceMap(service.priceMap);
          }
          setLoading(false);
        }
      });

      if (serviceId === "houseCleaning") {
        setBathroomOptions([]);
        setBedroomOptions([]);
        let houseInfo = customerProfile?.addresses[0]?.houseInfo;
        let bathOptions: BathBedOptions[] = [];
        let bedOptions: BathBedOptions[] = [];
        console.log();
        for (let i of [1, 2, 3, 4, 5]) {
          bathOptions.push({
            number: i,
            selected:
              (houseInfo &&
                houseInfo?.bathrooms &&
                parseInt(houseInfo?.bathrooms) == i) ||
              false,
          });

          bedOptions.push({
            number: i,
            selected:
              (houseInfo &&
                houseInfo?.bedrooms &&
                parseInt(houseInfo?.bedrooms) == i) ||
              false,
          });
        }
        setBathroomOptions(bathOptions);
        setBedroomOptions(bedOptions);
      }

      if (["pestControl", "poolCleaning"].includes(serviceId)) {
        getServiceCostMutation.mutate([
          {
            serviceId,
            serviceParameters: {},
          },
        ]);
      }
      setLoading(false);
    }
  }, [serviceId, services, customerProfile]);

  React.useEffect(() => {
    if (selectedBathroomNo && selectedBedroomNo) {
      getServiceCostMutation.mutate([
        {
          serviceId,
          serviceParameters: {
            bedrooms: selectedBedroomNo,
            bathrooms: selectedBathroomNo,
          },
        },
      ]);
    }
  }, [selectedBathroomNo, selectedBedroomNo]);

  const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const [appointmentDateOptions, setAppointmentDateOptions] =
    useState<AppointmentDateOptionType[]>();

  const [appointmentTimeOptions, setAppointmentTimeOptions] =
    useState<AppointmentTimeOptionType[]>();

  React.useEffect(() => {
    let dates: AppointmentDateOptionType[] = [];
    [7, 8, 9, 10].forEach((number) => {
      let date = new Date();
      date.setDate(date.getDate() + number);
      let month = date.getMonth() + 1;
      dates.push({
        fullDate: `${date.getFullYear()}-${
          month > 9 ? month : "0" + month
        }-${date.getDate()}`,
        date: date.getDate(),
        day: DAY[date.getDay()],
        month: MONTH[date.getMonth()],
        selected: false,
      });
    });
    setAppointmentDateOptions(dates);
    let times: AppointmentTimeOptionType[] = [];
    [8, 10, 12, 14].forEach((number) => {
      times.push({
        rangeMin: `${number > 12 ? number - 12 : number}`,
        rangeMax: `${number + 4 > 12 ? number + 4 - 12 : number + 4}`,
        minMeridian: `${number >= 12 ? "PM" : "AM"}`,
        maxMaxidian: `${number + 4 >= 12 ? "PM" : "AM"}`,
        selected: false,
      });
    });
    setAppointmentTimeOptions(times);
  }, []);

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
                  {serviceId === "lawnCare" && (
                    <>
                      {SectionDivider(0)}
                      {Title("Choose Lawn Size (Sq Ft)")}
                      {SectionDivider(0)}

                      <HStack
                        space={2}
                        maxWidth={screenWidth - 40}
                        flexWrap={"wrap"}
                        flexDirection="row"
                      >
                        {priceMap?.map((pm0, index) => {
                          return (
                            <View mb={1} key={index}>
                              <SelectionButton
                                w={(screenWidth - 60) / 2}
                                h={38}
                                index={index}
                                onPress={(index1) => {
                                  let updatedList = priceMap.map(
                                    (pm2, index2) => {
                                      if (index1 == index2) {
                                        setSelectedArea(pm2.rangeMax);
                                        let selected: PriceMap = {
                                          ...pm2,
                                          selected: true,
                                        };
                                        getServiceCostMutation.mutate([
                                          {
                                            serviceId,
                                            serviceParameters: {
                                              area: pm2.rangeMax,
                                            },
                                          },
                                        ]);
                                        return selected;
                                      }
                                      return { ...pm2, selected: false };
                                    }
                                  );
                                  setPriceMap(updatedList);
                                }}
                                active={pm0.selected}
                                text={`${pm0.rangeMin} - ${pm0.rangeMax}`}
                              />
                            </View>
                          );
                        })}
                      </HStack>
                    </>
                  )}
                  {serviceId === "houseCleaning" && (
                    <>
                      {SectionDivider(0)}
                      {Title("Choose Number of Bedrooms")}
                      {SectionDivider(0)}

                      <HStack
                        space={2}
                        maxWidth={screenWidth - 40}
                        flexWrap={"wrap"}
                        flexDirection="row"
                      >
                        {bedroomOptions.map((option, index) => {
                          return (
                            <View mb={1} key={index}>
                              <SelectionButton
                                w={(screenWidth - 60) / 7}
                                h={38}
                                index={index}
                                onPress={(index1) => {
                                  let updatedOptions = bedroomOptions.map(
                                    (opt, i) => {
                                      if (i === index1) {
                                        setSelectedBedroomNo(option.number);
                                        return {
                                          ...opt,
                                          selected: true,
                                        };
                                      }
                                      return {
                                        ...opt,
                                        selected: false,
                                      };
                                    }
                                  );
                                  setBedroomOptions(updatedOptions);
                                }}
                                active={option.selected}
                                text={`${option.number}`}
                              />
                            </View>
                          );
                        })}
                      </HStack>
                      {SectionDivider(0)}
                      {Title("Choose Number of Bathrooms")}
                      {SectionDivider(0)}
                      <HStack
                        space={2}
                        maxWidth={screenWidth - 40}
                        flexWrap={"wrap"}
                        flexDirection="row"
                      >
                        {bathroomOptions.map((option, index) => {
                          return (
                            <View mb={1} key={index}>
                              <SelectionButton
                                w={(screenWidth - 60) / 7}
                                h={38}
                                index={index}
                                onPress={(index1) => {
                                  let updatedOptions = bathroomOptions.map(
                                    (opt, i) => {
                                      if (i === index1) {
                                        setSelectedBathroomNo(opt.number);
                                        return {
                                          ...opt,
                                          selected: true,
                                        };
                                      }
                                      return {
                                        ...opt,
                                        selected: false,
                                      };
                                    }
                                  );
                                  setBathroomOptions(updatedOptions);
                                }}
                                active={option.selected}
                                text={`${option.number}`}
                              />
                            </View>
                          );
                        })}
                      </HStack>
                    </>
                  )}
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
                                        setSelectedTime(option.rangeMin);
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
        label="SAVE"
        onPress={async () => {
          await updateLeadMutation.mutateAsync();
          goBack();
        }}
      />
    </AppSafeAreaView>
  );
};

export default EditServiceDetails;
