import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  VStack,
  Text,
  HStack,
  Divider,
  TextArea,
  PresenceTransition,
} from "native-base";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SvgCss } from "react-native-svg";
import { useMutation, useQuery } from "react-query";
import { LAWN_CARE } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import { PriceMap, Service } from "../../commons/types";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import SelectionButton from "../../components/SelectionButton";
import { useAuth } from "../../contexts/AuthContext";
import { SuperRootStackParamList } from "../../navigations";
import { goBack } from "../../navigations/rootNavigation";
import { getServices, putLead } from "../../services/order";
import { SERVICES } from "./ChooseService";

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

  const [services, setServices] = React.useState<Service[]>([{} as Service]);

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

  //   pricePer2Weeks: 33
  // pricePerMonth: 37
  // pricePerOnetime: 40
  // pricePerWeek: 30

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
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}>
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
                {SectionDivider(0)}
                <VStack>
                  {serviceId === "lawnCare" && (
                    <>
                      {Title("Choose Lawn Size (Sq Ft)")}
                      {SectionDivider(0)}
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                      >
                        <HStack space={2}>
                          {priceMap?.map((pm0, index) => {
                            return (
                              <SelectionButton
                                key={index}
                                w={120}
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
                                text={`${pm0.rangeMin}-${pm0.rangeMax}`}
                              />
                            );
                          })}
                        </HStack>
                      </ScrollView>
                    </>
                  )}

                  {SectionDivider(0)}
                  {Title("Choose Subscription Method")}
                  {SectionDivider(0)}
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <HStack space={2}>
                      {selectedPriceMap &&
                        priceList.map((p, index) => {
                          return (
                            <SelectionButton
                              key={index}
                              w={140}
                              h={70}
                              variant="custom"
                              active={p.selected}
                              index={index}
                              onPress={(index1) => {
                                let updatedList = priceList.map(
                                  (p2, index2) => {
                                    if (index1 == index2) {
                                      let selected: PriceListType = {
                                        ...p2,
                                        selected: true,
                                      };
                                      setPriceType(selected);
                                      return selected;
                                    }
                                    return { ...p2, selected: false };
                                  }
                                );
                              }}
                              text2={(color) => {
                                return (
                                  <VStack
                                    justifyContent={"center"}
                                    alignItems={"center"}
                                  >
                                    <Text
                                      fontSize={14}
                                      color={color}
                                      textTransform="capitalize"
                                    >
                                      <Text fontSize={20} color={color}>
                                        ${p.cost}
                                      </Text>{" "}
                                      / {p.frequency}
                                    </Text>
                                    <Text
                                      textAlign={"center"}
                                      fontSize={12}
                                      color={color}
                                    >
                                      {p.frequency === "ONCE"
                                        ? "One-time Service"
                                        : `$${p.monthlyCost} Billed Monthly`}
                                    </Text>
                                  </VStack>
                                );
                              }}
                            />
                          );
                        })}
                    </HStack>
                  </ScrollView>
                  {SectionDivider(0)}
                  {Title("Choose Date")}
                  {SectionDivider(0)}
                  <HStack space={2}>
                    <SelectionButton
                      w={75}
                      h={75}
                      variant="custom"
                      active={true}
                      text2={(color) => {
                        return (
                          <VStack
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Text color={color}>Mon</Text>
                            <Text color={color}>Aug 2</Text>
                          </VStack>
                        );
                      }}
                      onPress={function (index: number): void {
                        throw new Error("Function not implemented.");
                      }}
                      index={0}
                    />
                    <SelectionButton
                      w={75}
                      h={75}
                      variant="custom"
                      active={false}
                      text2={(color) => {
                        return (
                          <VStack
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Text color={color}>Tue</Text>
                            <Text color={color}>Aug 3</Text>
                          </VStack>
                        );
                      }}
                      onPress={function (index: number): void {
                        throw new Error("Function not implemented.");
                      }}
                      index={0}
                    />
                  </HStack>
                  {SectionDivider(0)}
                  {Title("Choose Timeslot")}
                  {SectionDivider(0)}
                  <VStack space={2}>
                    <HStack space={2}>
                      <SelectionButton
                        w={120}
                        active={true}
                        text="8 AM - 10 AM"
                        onPress={function (index: number): void {
                          throw new Error("Function not implemented.");
                        }}
                        index={0}
                      />
                      <SelectionButton
                        w={120}
                        active={false}
                        text="10 AM - 2 PM"
                        onPress={function (index: number): void {
                          throw new Error("Function not implemented.");
                        }}
                        index={0}
                      />
                    </HStack>
                    <HStack space={2}>
                      <SelectionButton
                        w={120}
                        active={false}
                        text="2 PM - 6 PM"
                        onPress={function (index: number): void {
                          throw new Error("Function not implemented.");
                        }}
                        index={0}
                      />
                      <SelectionButton
                        w={120}
                        active={false}
                        text="6 PM - 8 PM"
                        onPress={function (index: number): void {
                          throw new Error("Function not implemented.");
                        }}
                        index={0}
                      />
                    </HStack>
                    {SectionDivider(0)}
                    {Title("Add Service Note")}
                    <Divider thickness={0} mt={1}></Divider>

                    <TextArea numberOfLines={5} mb={50}></TextArea>
                    <Divider thickness={0} mt={250}></Divider>
                  </VStack>
                </VStack>
              </ScrollView>
            </KeyboardAvoidingView>
          </VStack>
        </PresenceTransition>
      )}
      <FooterButton label="SAVE" onPress={() => goBack()} />
    </AppSafeAreaView>
  );
};

export default EditServiceDetails;
