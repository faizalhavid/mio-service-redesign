import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatList, HStack, Pressable, Spacer, Text, VStack } from "native-base";
import React, { useEffect } from "react";
import { Dimensions } from "react-native";
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
import { StorageHelper } from "../../services/storage-helper";
import { deepClone } from "../../services/utils";
import { selectCustomer } from "../../slices/customer-slice";
import {
  selectLead,
  createLeadAsync,
  updateLeadAsync,
} from "../../slices/lead-slice";
import {
  getServiceCostAsync,
  selectSelectedServices,
  selectServiceCost,
  updateSelectedServices,
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

  const { mode } = route.params;

  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] =
    React.useState<any>({});

  const [subscriptionMethodOptions, setSubscriptionMethodOptions] =
    React.useState<any[]>([]);

  const [planOptions, setPlanOptions] = React.useState<PlanOption[]>([]);
  const [selectedPlan, setSelectedPlan] = React.useState<string>("BASIC");

  const { member: selectedService } = useAppSelector(selectSelectedServices);

  const { collection: selectedServices } = useAppSelector(
    selectSelectedServices
  );

  const { member: customer } = useAppSelector(selectCustomer);

  const { member: leadDetails, uiState: leadDetailsUiState } =
    useAppSelector(selectLead);

  const { collection: serviceCost, uiState: serviceCostUiState } =
    useAppSelector(selectServiceCost);

  const frequencyColumns = 2;

  const createLead = async () => {
    let subOrders = [];
    if (selectedService === LAWN_CARE_ID) {
      subOrders.push({
        area: customer.addresses[0].houseInfo?.lotSize,
        serviceId: selectedService,
      });
    } else if (selectedService === HOUSE_CLEANING_ID) {
      subOrders.push({
        bedrooms: customer.addresses[0].houseInfo?.bedrooms,
        bathrooms: customer.addresses[0].houseInfo?.bathrooms,
        serviceId: selectedService,
      });
    } else {
      subOrders.push({ serviceId: selectedService });
    }
    return dispatch(createLeadAsync({ subOrders }));
  };

  const updateLead = async (_leadDetails: LeadDetails) => {
    let existingServiceIds = _leadDetails.subOrders.map(
      (subOrder) => subOrder.serviceId
    );
    let isNewlyAdded = existingServiceIds.indexOf(selectedService) < 0;

    let lead: LeadDetails = deepClone(_leadDetails);
    let payload = {
      ...lead,
      subOrders: [...lead.subOrders],
    };
    if (isNewlyAdded) {
      payload.subOrders.push({
        ...({} as SubOrder),
        serviceId: selectedService,
      });
    }

    let updatedSuborders = payload.subOrders.map((subOrder) => {
      if (subOrder.serviceId === selectedService) {
        if (!subOrder.servicePrice) {
          subOrder.servicePrice = {} as ServicePrice;
        }
        if (!subOrder.flags) {
          subOrder.flags = {} as Flags2;
        }
        subOrder.flags.plan = selectedPlan;
        if (selectedSubscriptionMethod.type === "ONCE") {
          subOrder.servicePrice.cost = selectedSubscriptionMethod.perCost;
          subOrder.flags.recurringDuration = "ONCE";
          subOrder.flags.isRecurring = false;
        } else {
          subOrder.servicePrice.cost = selectedSubscriptionMethod?.perCost;
          subOrder.flags.recurringDuration = selectedSubscriptionMethod?.type;
          subOrder.flags.isRecurring = true;
        }
      }
      return subOrder;
    });

    payload.subOrders = updatedSuborders;

    return dispatch(updateLeadAsync(payload));
  };

  useEffect(() => {
    if (selectedService) {
      if (selectedService === LAWN_CARE_ID) {
        let lotsize: number = customer.addresses[0].houseInfo?.lotSize || 0;
        dispatch(
          getServiceCostAsync([
            {
              serviceId: selectedService,
              serviceParameters: {
                area: lotsize,
              },
            },
          ])
        );
      } else if (selectedService === HOUSE_CLEANING_ID) {
        dispatch(
          getServiceCostAsync([
            {
              serviceId: selectedService,
              serviceParameters: {
                bedrooms: customer.addresses[0].houseInfo?.bedrooms || 1,
                bathrooms: customer.addresses[0].houseInfo?.bathrooms || 1,
              },
            },
          ])
        );
      } else if (
        [PEST_CONTROL_ID, POOL_CLEANING_ID].includes(selectedService)
      ) {
        dispatch(
          getServiceCostAsync([
            {
              serviceId: selectedService,
              serviceParameters: {},
            },
          ])
        );
      }
    }
  }, [selectedService]);

  useEffect(() => {
    if (serviceCost.length > 0) {
      let isUpdate = mode === "UPDATE";
      let subOrder = {} as SubOrder;
      if (isUpdate) {
        subOrder = leadDetails.subOrders.filter(
          (so) => so.serviceId === selectedService
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

  useEffect(() => {
    if (Object.keys(selectedSubscriptionMethod).length > 0) {
      let preSelectedPlan = "BASIC";
      let isUpdate = mode === "UPDATE";
      if (isUpdate) {
        let subOrder = leadDetails.subOrders.filter(
          (so) => so.serviceId === selectedService
        )[0];
        preSelectedPlan = subOrder.flags.plan;
      }
      const serviceCosts = serviceCost.filter(
        (cost) =>
          cost.serviceId === selectedService &&
          ["BASIC", "STANDARD", "PREMIUM"].indexOf(cost.plan) >= 0
      );
      let options: PlanOption[] = [];
      for (let cost of serviceCosts) {
        if (selectedSubscriptionMethod.type === "WEEKLY") {
          options.push({
            label: cost.plan,
            cost: parseInt(cost.pricePerWeek),
            selected: preSelectedPlan === cost.plan,
          });
        } else if (selectedSubscriptionMethod.type === "BIWEEKLY") {
          options.push({
            label: cost.plan,
            cost: parseInt(cost.pricePer2Weeks),
            selected: preSelectedPlan === cost.plan,
          });
        } else if (selectedSubscriptionMethod.type === "MONTHLY") {
          options.push({
            label: cost.plan,
            cost: parseInt(cost.pricePerMonth),
            selected: preSelectedPlan === cost.plan,
          });
        } else if (selectedSubscriptionMethod.type === "QUARTERLY") {
          options.push({
            label: cost.plan,
            cost: parseInt(cost.pricePerQuarterly),
            selected: preSelectedPlan === cost.plan,
          });
        } else if (selectedSubscriptionMethod.type === "ONCE") {
          options.push({
            label: cost.plan,
            cost: parseInt(cost.pricePerOnetime),
            selected: preSelectedPlan === cost.plan,
          });
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
      <VStack mt={3} space={5}>
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
                      setSelectedPlan(opt.label);
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
                  <VStack>
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
                    <Text
                      color={AppColors.DARK_PRIMARY}
                      fontSize={14}
                      fontWeight={"semibold"}
                    >
                      Benefits
                    </Text>
                    {[1, 2, 3].map((b, i) => (
                      <Text
                        key={i}
                        color={AppColors.DARK_PRIMARY}
                        fontSize={12}
                      >
                        {b}. This is the benefit one
                      </Text>
                    ))}
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
        disabled={false}
        loading={
          leadDetailsUiState === "IN_PROGRESS" ||
          serviceCostUiState === "IN_PROGRESS"
        }
        subText="Please add required services"
        onPress={async () => {
          dispatch(
            updateSelectedServices({ selectedService: selectedService })
          );
          const leadId = await StorageHelper.getValue("LEAD_ID");
          if (!leadId) {
            let _leadDetails = await createLead();
            await StorageHelper.setValue(
              "LEAD_ID",
              _leadDetails.payload.leadId
            );
            await updateLead(_leadDetails.payload);
          } else {
            await updateLead(leadDetails);
          }
          goBack();
        }}
      />
      {/* </ScrollView> */}
    </AppSafeAreaView>
  );
};

export default ChoosePlan;
