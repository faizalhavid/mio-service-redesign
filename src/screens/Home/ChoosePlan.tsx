import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Divider,
  FlatList,
  HStack,
  MinusIcon,
  Pressable,
  Spacer,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { SvgCss } from "react-native-svg";
import { CHECKBOX_TICK_ICON, PLUS_ICON } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import {
  Flags2,
  LeadDetails,
  PlanOption,
  PriceMap,
  ServicePrice,
  SubOrder,
} from "../../commons/types";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { SuperRootStackParamList } from "../../navigations";
import { goBack } from "../../navigations/rootNavigation";
import { getServiceDetails } from "../../services/service-details";
import { StorageHelper } from "../../services/storage-helper";
import { selectCustomer } from "../../slices/customer-slice";
import {
  selectLead,
  createLeadAsync,
  updateLeadAsync,
} from "../../slices/lead-slice";
import {
  getServiceCostAsync,
  selectServiceCost,
} from "../../slices/service-slice";
import {
  LAWN_CARE_ID,
  HOUSE_CLEANING_ID,
  PEST_CONTROL_ID,
  POOL_CLEANING_ID,
} from "./ChooseService";

type ChoosePlanProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "ChoosePlan"
>;

const ChoosePlan = ({ route }: ChoosePlanProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const { mode, serviceId } = route.params;

  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] =
    React.useState<any>({});

  const [subscriptionMethodOptions, setSubscriptionMethodOptions] =
    React.useState<any[]>([]);

  const [planOptions, setPlanOptions] = React.useState<PlanOption[]>([]);
  const [selectedPlan, setSelectedPlan] = React.useState<PlanOption>();

  const { member: customer } = useAppSelector(selectCustomer);

  const { member: leadDetails, uiState: leadDetailsUiState } =
    useAppSelector(selectLead);

  const { collection: serviceCost, uiState: serviceCostUiState } =
    useAppSelector(selectServiceCost);

  const frequencyColumns = 2;

  const [benefitExpand, setBenefitExpand] = React.useState<any>({});

  const createLead = async () => {
    let subOrders = [];
    if (serviceId === LAWN_CARE_ID) {
      subOrders.push({
        area: leadDetails?.customerProfile?.addresses?.[0]?.houseInfo?.lotSize,
        serviceId: serviceId,
      });
    } else if (serviceId === HOUSE_CLEANING_ID) {
      subOrders.push({
        bedrooms:
          leadDetails?.customerProfile?.addresses?.[0]?.houseInfo?.bedrooms,
        bathrooms:
          leadDetails?.customerProfile?.addresses?.[0]?.houseInfo?.bathrooms,
        serviceId: serviceId,
      });
    } else {
      subOrders.push({ serviceId: serviceId });
    }
    return dispatch(createLeadAsync({ subOrders }));
  };

  const updateLead = async (_leadDetails: LeadDetails) => {
    let existingServiceIds = _leadDetails.subOrders.map(
      (subOrder) => subOrder.serviceId
    );
    let isNewlyAdded = existingServiceIds.indexOf(serviceId) < 0;
    let payload = {
      ..._leadDetails,
      subOrders: [..._leadDetails.subOrders],
    };
    if (isNewlyAdded) {
      payload.subOrders.push({
        ...({} as SubOrder),
        serviceId: serviceId,
      });
    }
    let updatedSuborders = payload.subOrders.map((subOrder) => {
      if (serviceId === LAWN_CARE_ID) {
        subOrder.area =
          payload.customerProfile.addresses[0].houseInfo?.lotSize || 0;
      } else if (serviceId === HOUSE_CLEANING_ID) {
        subOrder.bedrooms =
          payload.customerProfile.addresses[0].houseInfo?.bedrooms;
        subOrder.bathrooms =
          payload.customerProfile.addresses[0].houseInfo?.bathrooms;
      }
      if (subOrder.serviceId === serviceId) {
        if (!subOrder.servicePrice) {
          subOrder.servicePrice = {} as ServicePrice;
        }
        if (!subOrder.flags) {
          subOrder.flags = {} as Flags2;
        }
        subOrder.flags.plan = selectedPlan?.label || "STANDARD";
        if (selectedSubscriptionMethod.type === "ONCE") {
          subOrder.servicePrice.cost = selectedPlan?.cost || 0;
          subOrder.flags.recurringDuration = "ONCE";
          subOrder.flags.isRecurring = false;
        } else {
          subOrder.servicePrice.cost = selectedPlan?.cost || 0;
          subOrder.flags.recurringDuration = selectedSubscriptionMethod?.type;
          subOrder.flags.isRecurring = true;
        }
      }
      return subOrder;
    });
    payload.subOrders = updatedSuborders;
    return dispatch(updateLeadAsync(payload));
  };

  // const updateLead = async (pleadDetails: LeadDetails) => {
  //   let _leadDetails = { ...pleadDetails };

  //   if (isAuthenticated) {
  //     _leadDetails = {
  //       ..._leadDetails,
  //       customerProfile: {
  //         ..._leadDetails.customerProfile,
  //         ...customer,
  //         addresses: [
  //           ...customer?.addresses?.filter((address) => address.isPrimary),
  //         ],
  //       },
  //     };
  //   }

  //   _leadDetails.subOrders = updateSubOrders(_leadDetails);

  //   return dispatch(updateLeadAsync(_leadDetails));
  // };

  const updateSubOrders = (_leadDetails: LeadDetails) => {
    let _subOrders: SubOrder[] = [];

    if (_leadDetails.subOrders && _leadDetails.subOrders.length > 0) {
      _subOrders = [..._leadDetails.subOrders];
    }

    // Update Area
    const index1 = _subOrders.findIndex(
      (subOrder2) => subOrder2.serviceId === LAWN_CARE_ID
    );
    _subOrders[index1] = {
      ..._subOrders[index1],
      area: _leadDetails.customerProfile.addresses[0].houseInfo?.lotSize || 0,
    };
    // Update Bedroom Bathroom
    const index2 = _subOrders.findIndex(
      (subOrder2) => subOrder2.serviceId === HOUSE_CLEANING_ID
    );
    _subOrders[index2] = {
      ..._subOrders[index2],
      bedrooms: _leadDetails.customerProfile.addresses[0].houseInfo?.bedrooms,
      bathrooms: _leadDetails.customerProfile.addresses[0].houseInfo?.bathrooms,
    };

    return _subOrders;
  };

  useEffect(() => {
    if (serviceId) {
      if (serviceId === LAWN_CARE_ID) {
        let lotsize: number =
          leadDetails?.customerProfile?.addresses?.[0]?.houseInfo?.lotSize || 0;
        dispatch(
          getServiceCostAsync([
            {
              serviceId: serviceId,
              serviceParameters: {
                area: lotsize,
              },
            },
          ])
        );
      } else if (serviceId === HOUSE_CLEANING_ID) {
        dispatch(
          getServiceCostAsync([
            {
              serviceId: serviceId,
              serviceParameters: {
                bedrooms:
                  leadDetails?.customerProfile?.addresses?.[0]?.houseInfo
                    ?.bedrooms || 1,
                bathrooms:
                  leadDetails?.customerProfile?.addresses?.[0]?.houseInfo
                    ?.bathrooms || 1,
              },
            },
          ])
        );
      } else if ([PEST_CONTROL_ID, POOL_CLEANING_ID].includes(serviceId)) {
        dispatch(
          getServiceCostAsync([
            {
              serviceId: serviceId,
              serviceParameters: {},
            },
          ])
        );
      }
    }
  }, [serviceId]);

  useEffect(() => {
    if (serviceCost.length > 0) {
      let isUpdate = mode === "UPDATE";
      let subOrder = {} as SubOrder;
      if (isUpdate) {
        subOrder = leadDetails.subOrders.filter(
          (so) => so.serviceId === serviceId
        )[0];
      }
      let subscriptionOptions: any[] = [];
      let priceMap: PriceMap[] = serviceCost;
      if (priceMap && priceMap[0]) {
        let pricePerWeekExists =
          priceMap[0].pricePerWeek && parseInt(priceMap[0].pricePerWeek) !== 0;
        let pricePer2WeeksExists =
          priceMap[0].pricePer2Weeks &&
          parseInt(priceMap[0].pricePer2Weeks) !== 0;
        let pricePerMonthExists =
          priceMap[0].pricePerMonth &&
          parseInt(priceMap[0].pricePerMonth) !== 0;
        let pricePerQuarterlyExists =
          priceMap[0].pricePerQuarterly &&
          parseInt(priceMap[0].pricePerQuarterly) !== 0;

        if (pricePerWeekExists) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePerWeek,
            type: "WEEKLY",
            label: "Weekly",
            selected: false,
          });
        }
        if (pricePer2WeeksExists) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePer2Weeks,
            type: "BIWEEKLY",
            label: "Bi-Weekly",
            selected: false,
          });
        }
        if (pricePerMonthExists) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePerMonth,
            type: "MONTHLY",
            label: "Monthly",
            selected: false,
          });
        }
        if (pricePerQuarterlyExists) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePerQuarterly,
            type: "QUARTERLY",
            label: "Quarterly",
            selected: false,
          });
        }
        if (
          pricePerWeekExists ||
          pricePer2WeeksExists ||
          pricePerMonthExists ||
          pricePerQuarterlyExists
        ) {
          if (isUpdate) {
            let selectedIndex: number = 0;
            for (let i = 0; i < subscriptionOptions.length; i++) {
              if (
                subscriptionOptions[i].type ===
                subOrder?.flags?.recurringDuration
              ) {
                selectedIndex = i;
              }
            }
            subscriptionOptions[selectedIndex] = {
              ...subscriptionOptions[selectedIndex],
              selected: true,
            };
            setSelectedSubscriptionMethod(subscriptionOptions[selectedIndex]);
          } else {
            subscriptionOptions[0] = {
              ...subscriptionOptions[0],
              selected: true,
            };
            setSelectedSubscriptionMethod(subscriptionOptions[0]);
          }
        }

        if (
          priceMap[0].pricePerOnetime &&
          parseInt(priceMap[0].pricePerOnetime) !== 0
        ) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePerOnetime,
            type: "ONCE",
            label: "One-Time",
            selected: isUpdate
              ? subOrder?.flags.isRecurring
                ? false
                : true
              : false,
          });
        }
      }
      setSubscriptionMethodOptions(subscriptionOptions);
    }
  }, [serviceCost]);

  const { groupedServiceDetails } = getServiceDetails();

  useEffect(() => {
    if (Object.keys(selectedSubscriptionMethod).length > 0) {
      let preSelectedPlan = "STANDARD";
      let isUpdate = mode === "UPDATE";
      if (isUpdate) {
        let subOrder = leadDetails.subOrders.filter(
          (so) => so.serviceId === serviceId
        )[0];
        preSelectedPlan = subOrder.flags.plan;
      }
      const serviceCosts = serviceCost.filter(
        (cost) =>
          cost.serviceId === serviceId &&
          ["STANDARD", "PREMIUM", "FULL CARE"].indexOf(cost.plan) >= 0
      );
      let options: PlanOption[] = [];
      if (selectedSubscriptionMethod.type === "WEEKLY") {
        for (let cost of serviceCosts) {
          let option: PlanOption = {
            label: cost.plan,
            benefits:
              groupedServiceDetails[serviceId].packageDescription[cost.plan] ||
              [],
            cost: parseInt(cost.pricePerWeek),
            selected: preSelectedPlan === cost.plan,
          };
          if (preSelectedPlan === cost.plan) {
            setSelectedPlan(option);
          }
          options.push(option);
        }
      } else if (selectedSubscriptionMethod.type === "BIWEEKLY") {
        for (let cost of serviceCosts) {
          let option = {
            label: cost.plan,
            benefits:
              groupedServiceDetails[serviceId].packageDescription[cost.plan] ||
              [],
            cost: parseInt(cost.pricePer2Weeks),
            selected: preSelectedPlan === cost.plan,
          };
          if (preSelectedPlan === cost.plan) {
            setSelectedPlan(option);
          }
          options.push(option);
        }
      } else if (selectedSubscriptionMethod.type === "MONTHLY") {
        for (let cost of serviceCosts) {
          let option = {
            label: cost.plan,
            benefits:
              groupedServiceDetails[serviceId].packageDescription[cost.plan] ||
              [],
            cost: parseInt(cost.pricePerMonth),
            selected: preSelectedPlan === cost.plan,
          };
          if (preSelectedPlan === cost.plan) {
            setSelectedPlan(option);
          }
          options.push(option);
        }
      } else if (selectedSubscriptionMethod.type === "QUARTERLY") {
        for (let cost of serviceCosts) {
          let option = {
            label: cost.plan,
            benefits:
              groupedServiceDetails[serviceId].packageDescription[cost.plan] ||
              [],
            cost: parseInt(cost.pricePerQuarterly),
            selected: preSelectedPlan === cost.plan,
          };
          if (preSelectedPlan === cost.plan) {
            setSelectedPlan(option);
          }
          options.push(option);
        }
      } else if (selectedSubscriptionMethod.type === "ONCE") {
        for (let cost of serviceCosts) {
          let option = {
            label: cost.plan,
            benefits:
              groupedServiceDetails[serviceId].packageDescription[cost.plan] ||
              [],
            cost: parseInt(cost.pricePerOnetime),
            selected: preSelectedPlan === cost.plan,
          };
          if (preSelectedPlan === cost.plan) {
            setSelectedPlan(option);
          }
          options.push(option);
        }
      }
      setPlanOptions(options);
    }
  }, [selectedSubscriptionMethod]);

  return (
    <AppSafeAreaView
      loading={
        leadDetailsUiState === "IN_PROGRESS" ||
        serviceCostUiState === "IN_PROGRESS"
      }
    >
      {/* <ScrollView> */}
      <VStack mt={"1/5"} space={5}>
        <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
          Choose Frequency
        </Text>
        <HStack
          justifyContent={"center"}
          alignItems={"center"}
          space={0}
          bg={"#eee"}
          p={3}
        >
          <FlatList
            data={subscriptionMethodOptions}
            numColumns={frequencyColumns}
            contentContainerStyle={{
              alignSelf: "center",
              // justifyContent: "center",
              // alignItems: "center",
              width: "100%",
            }}
            renderItem={({ index, item }) => (
              <Pressable
                key={index}
                height={10}
                borderRadius={5}
                width={"48%"}
                m={1}
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
                  let updatedOptions = subscriptionMethodOptions.map(
                    (opt, i) => {
                      if (i === index) {
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
                    }
                  );
                  setSubscriptionMethodOptions(updatedOptions);
                }}
              >
                <Text
                  alignSelf={"center"}
                  color={AppColors.TEAL}
                  fontWeight={"semibold"}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
          />
        </HStack>
        <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
          Choose Plan
        </Text>
        <HStack
          justifyContent={"center"}
          alignItems={"center"}
          space={0}
          bg={"#eee"}
          p={3}
          pb={200}
        >
          <FlatList
            data={planOptions}
            contentContainerStyle={{
              width: "100%",
              paddingBottom: 500,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ index, item }) => (
              <Pressable
                alignSelf={"center"}
                key={index}
                borderColor={AppColors.TEAL}
                bg={item.selected ? AppColors.LIGHT_TEAL : "#fff"}
                borderWidth={item.selected ? 1 : 0}
                minHeight={100}
                borderRadius={6}
                width={"100%"}
                m={1}
                p={3}
                _pressed={{
                  borderColor: AppColors.TEAL,
                  borderWidth: 1,
                  backgroundColor: AppColors.LIGHT_TEAL,
                }}
                onPress={() => {
                  let updatedOptions = planOptions.map((opt, i) => {
                    if (i === index) {
                      setSelectedPlan(opt);
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
                  setPlanOptions(updatedOptions);
                }}
              >
                <HStack justifyContent={"space-between"}>
                  <VStack width={"80%"}>
                    <Text
                      color={AppColors.TEAL}
                      fontSize={18}
                      fontWeight={"semibold"}
                    >
                      {item.label}
                    </Text>
                    <Spacer
                      borderWidth={0.5}
                      my={1}
                      borderColor="#eee"
                      borderRadius={5}
                    />
                    <VStack
                      py={2}
                      divider={
                        <Divider
                          thickness={0.6}
                          mb={2}
                          mt={2}
                          bg={AppColors.CCC}
                        />
                      }
                    >
                      {item.benefits.map((b, i) => {
                        const hasDescription =
                          (typeof b.description === "string" ||
                            typeof b.description === "object") &&
                          b.description.length > 0
                            ? true
                            : false;
                        return (
                          <VStack key={i}>
                            <Pressable
                              onPress={() => {
                                let payload = {
                                  ...benefitExpand,
                                  [serviceId]: {
                                    [b.title]: hasDescription
                                      ? benefitExpand?.[serviceId]?.[
                                          b.title
                                        ] === true
                                        ? false
                                        : true
                                      : false,
                                  },
                                };
                                setBenefitExpand(payload);
                              }}
                            >
                              <HStack
                                justifyContent={"space-between"}
                                alignItems="center"
                              >
                                <HStack alignItems={"center"} space={1}>
                                  <SvgCss
                                    xml={CHECKBOX_TICK_ICON}
                                    // width={30}
                                    height={14}
                                  />
                                  <Text
                                    color={AppColors.DARK_PRIMARY}
                                    fontSize={14}
                                    fontWeight={"semibold"}
                                  >
                                    {b.title}
                                  </Text>
                                </HStack>
                                {hasDescription && (
                                  <View px={3}>
                                    {!benefitExpand?.[serviceId]?.[b.title] ? (
                                      <SvgCss
                                        xml={PLUS_ICON(AppColors.TEAL)}
                                        height={9}
                                      />
                                    ) : (
                                      <Text
                                        color={AppColors.TEAL}
                                        fontSize={14}
                                        pr={2.5}
                                        fontWeight={"semibold"}
                                      >
                                        -
                                      </Text>
                                    )}
                                  </View>
                                )}
                              </HStack>
                            </Pressable>
                            {(hasDescription
                              ? benefitExpand?.[serviceId]?.[b.title]
                              : false) && (
                              <Text
                                color={AppColors.DARK_PRIMARY}
                                fontSize={12}
                                pl={6}
                                py={2}
                              >
                                {b.description}
                              </Text>
                            )}
                          </VStack>
                        );
                      })}
                    </VStack>
                  </VStack>
                  <VStack
                    alignItems={"center"}
                    alignContent="center"
                    justifyContent={"flex-start"}
                    pr={5}
                  >
                    <Text
                      color={AppColors.DARK_PRIMARY}
                      fontSize={24}
                      fontWeight={"semibold"}
                    >
                      ${item.cost}
                    </Text>
                    <Text color={"#bbb"} fontSize={12} fontWeight={"semibold"}>
                      {selectedSubscriptionMethod?.label?.toUpperCase()}
                    </Text>
                  </VStack>
                </HStack>
              </Pressable>
            )}
          />
        </HStack>
      </VStack>
      <FooterButton
        type="PLAN_SELECTION"
        label="DONE"
        serviceId={serviceId}
        disabled={false}
        loading={
          leadDetailsUiState === "IN_PROGRESS" ||
          serviceCostUiState === "IN_PROGRESS"
        }
        subText="Please add required services"
        onPress={async () => {
          await updateLead(leadDetails);
          goBack();
        }}
      />
      {/* </ScrollView> */}
    </AppSafeAreaView>
  );
};

export default ChoosePlan;
