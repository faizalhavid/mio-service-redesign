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
import { PriceMap, Service } from "../../commons/types";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import SelectionButton from "../../components/SelectionButton";
import { CustomerProfile, useAuth } from "../../contexts/AuthContext";
import { SuperRootStackParamList } from "../../navigations";
import { goBack } from "../../navigations/rootNavigation";
import { getServices, putLead } from "../../services/order";
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

type EditServiceDetailsProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "EditServiceDetails"
>;
const EditServiceDetails = ({
  route,
}: EditServiceDetailsProps): JSX.Element => {
  const { serviceId } = route.params;
  // const LAWN_CARE_INFO = <ServiceDetailsOptions title="HOW BIG IS YOUR LOT?" />;
  // const POOL_LEANING_INFO = (
  //   <ServiceDetailsOptions title="WHAT TYPE OF POOL DO YOU HAVE?" />
  // );
  // const HOUSE_CLEANING_INFO = (
  //   <>
  //     <ServiceDetailsOptions title="HOW MANY STORIES IN YOUR HOME?" />
  //     <Divider thickness={0} mt={3} />
  //     <ServiceDetailsOptions title="HOW MANY BEDROOMS?" />
  //     <Divider thickness={0} mt={3} />
  //     <ServiceDetailsOptions title="HOW MANY BATHROOMS?" />
  //   </>
  // );
  // const PES_CONTROL_INFO = (
  //   <ServiceDetailsOptions title="WHAT TYPE OF PESTS ARE YOU DEALING WITH?" />
  // );

  const [loading, setLoading] = React.useState(false);

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
    "createLead",
    (data) => {
      setLoading(true);
      let payload = {
        subOrders: [
          // ...leadDetails
        ],
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

  const [showFields, setShowFields] = React.useState(false);

  const [selectedPriceMap, setSelectedPriceMap] = React.useState<PriceMap>();

  const updateShowFields = React.useCallback(async () => {
    setTimeout(() => {
      setShowFields(true);
    }, 0);
  }, []);

  React.useEffect(() => {
    updateShowFields();
  }, [updateShowFields]);

  const [priceMap, setPriceMap] = React.useState<PriceMap[]>([]);

  React.useEffect(() => {
    if (serviceId && services) {
      services.forEach((service) => {
        if (service.serviceId === serviceId) {
          setPriceMap(service.priceMap);
        }
      });
    }
  }, [serviceId, services]);

  const frequencyType: any = {
    pricePer2Weeks: {
      key: "BIWEEKLY",
      multiplyBy: 2,
      position: 2,
    },
    pricePerMonth: {
      key: "MONTHLY",
      multiplyBy: 1,
      position: 3,
    },
    pricePerOnetime: {
      key: "ONCE",
      multiplyBy: 1,
      position: 0,
    },
    pricePerWeek: {
      key: "WEEKLY",
      multiplyBy: 4,
      position: 1,
    },
  };
  // const [priceList, setPriceList] = React.useState<PriceListType[]>([]);
  const [priceType, setPriceType] = React.useState<PriceListType>();
  const priceList: PriceListType[] = React.useMemo(() => {
    let _priceList: PriceListType[] = [];
    if (selectedPriceMap) {
      for (const [key, value] of Object.entries(selectedPriceMap)) {
        if (frequencyType[key]) {
          _priceList.push({
            frequency: frequencyType[key].key || "",
            cost: value,
            monthlyCost: frequencyType[key].multiplyBy * value,
            position: frequencyType[key].position,
            selected:
              priceType && priceType.frequency === frequencyType[key].key
                ? true
                : false,
          });
        }
      }
    }

    _priceList.sort((a, b) => (a.position > b.position ? 1 : -1));

    return _priceList;
  }, [selectedPriceMap, priceType]);

  const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTH = [
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
                                  setPriceType({} as PriceListType);
                                  let updatedList = priceMap.map(
                                    (pm2, index2) => {
                                      if (index1 == index2) {
                                        let selected: PriceMap = {
                                          ...pm2,
                                          selected: true,
                                        };
                                        setSelectedPriceMap(selected);
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
                        {[1, 2, 3, 4, 5].map((number, index) => {
                          return (
                            <View mb={1} key={index}>
                              <SelectionButton
                                w={(screenWidth - 60) / 7}
                                h={38}
                                index={index}
                                onPress={(index1) => {}}
                                active={false}
                                text={`${number}`}
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
                        {[1, 2, 3, 4, 5].map((number, index) => {
                          return (
                            <View mb={1} key={index}>
                              <SelectionButton
                                w={(screenWidth - 60) / 7}
                                h={38}
                                index={index}
                                onPress={(index1) => {}}
                                active={false}
                                text={`${number}`}
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
                        <SelectionButton
                          w={(screenWidth - 60) / 2}
                          h={90}
                          variant="custom"
                          active={true}
                          index={0}
                          onPress={(index1) => {
                            let updatedList = priceList.map((p2, index2) => {
                              if (index1 == index2) {
                                let selected: PriceListType = {
                                  ...p2,
                                  selected: true,
                                };
                                setPriceType(selected);
                                return selected;
                              }
                              return { ...p2, selected: false };
                            });
                          }}
                          text2={(color) => {
                            return (
                              <VStack space={1} justifyContent="center">
                                <HStack
                                  space={2}
                                  justifyContent="center"
                                  alignItems={"center"}
                                >
                                  <Text fontSize={30} color={color}>
                                    $40
                                  </Text>
                                  <Text fontSize={12} color={color}>
                                    / Weekly
                                  </Text>
                                </HStack>
                                <Text
                                  textAlign={"center"}
                                  fontSize={12}
                                  color={color}
                                >
                                  $80 Billed Monthly
                                </Text>
                              </VStack>
                            );
                          }}
                        />
                        <SelectionButton
                          w={(screenWidth - 60) / 2}
                          h={90}
                          variant="custom"
                          active={false}
                          index={0}
                          onPress={(index1) => {
                            let updatedList = priceList.map((p2, index2) => {
                              if (index1 == index2) {
                                let selected: PriceListType = {
                                  ...p2,
                                  selected: true,
                                };
                                setPriceType(selected);
                                return selected;
                              }
                              return { ...p2, selected: false };
                            });
                          }}
                          text2={(color) => {
                            return (
                              <VStack
                                space={1}
                                justifyContent="center"
                                alignItems={"center"}
                              >
                                <Text fontSize={30} color={color}>
                                  $40
                                </Text>

                                <Text
                                  textAlign={"center"}
                                  fontSize={12}
                                  color={color}
                                >
                                  One-time Service
                                </Text>
                              </VStack>
                            );
                          }}
                        />
                      </HStack>
                      {SectionDivider(0)}
                      <HStack
                        space={2}
                        maxWidth={screenWidth - 40}
                        flexWrap={"wrap"}
                        flexDirection="row"
                      >
                        {["Weekly", "Bi-Weekly", "Monthly"].map(
                          (name, index) => {
                            return (
                              <SelectionButton
                                key={index}
                                w={(screenWidth - 60) / 3.07}
                                active={false}
                                text={name}
                                onPress={function (index: number): void {
                                  throw new Error("Function not implemented.");
                                }}
                                index={0}
                              />
                            );
                          }
                        )}
                      </HStack>
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
                            throw new Error("Function not implemented.");
                          }}
                          index={0}
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
                                throw new Error("Function not implemented.");
                              }}
                              index={0}
                            />
                          </View>
                        );
                      })}
                    </HStack>
                    {SectionDivider(0)}
                    {Title("Add Service Note")}
                    <Divider thickness={0} mt={1}></Divider>

                    <TextArea numberOfLines={5} mb={50}></TextArea>
                    <Divider thickness={0} mt={250}></Divider>
                  </VStack>
                </VStack>
              </ScrollView>
            </KeyboardAwareScrollView>
          </VStack>
        </PresenceTransition>
      )}
      <FooterButton label="SAVE" onPress={() => goBack()} />
    </AppSafeAreaView>
  );
};

export default EditServiceDetails;
