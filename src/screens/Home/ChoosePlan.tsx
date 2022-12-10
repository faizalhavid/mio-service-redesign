import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Divider, FlatList, HStack, Pressable, Spacer, Text, View, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { SvgCss } from 'react-native-svg';
import { CHECKBOX_TICK_ICON, PLUS_ICON } from '../../commons/assets';
import { AppColors } from '../../commons/colors';
import {
  Flags2,
  LeadDetails,
  PlanOption,
  PriceMap,
  ServicePrice,
  SubOrder,
} from '../../commons/types';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import FooterButton from '../../components/FooterButton';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { SuperRootStackParamList } from '../../navigations';
import { goBack } from '../../navigations/rootNavigation';
import { getServiceDetails } from '../../services/service-details';
import { selectCustomer } from '../../slices/customer-slice';
import { selectLead, updateLeadAsync } from '../../slices/lead-slice';
import { getServiceCostAsync, selectServiceCost } from '../../slices/service-slice';
import {
  HANDYMAN_ID,
  HOUSE_CLEANING_ID,
  LAWN_CARE_ID,
  PEST_CONTROL_ID,
  POOL_CLEANING_ID,
} from './ChooseService';

type ChoosePlanProps = NativeStackScreenProps<SuperRootStackParamList, 'ChoosePlan'>;

function ChoosePlan({ route }: ChoosePlanProps): JSX.Element {
  const dispatch = useAppDispatch();

  const { mode, serviceId } = route.params;

  const [selectedSubscriptionMethod, setSelectedSubscriptionMethod] = React.useState<any>({});

  const [subscriptionMethodOptions, setSubscriptionMethodOptions] = React.useState<any[]>([]);

  const [backupPlanOptions, setBackupPlanOptions] = React.useState<PlanOption[]>([]);
  const [planOptions, setPlanOptions] = React.useState<PlanOption[]>([]);
  const [selectedPlan, setSelectedPlan] = React.useState<PlanOption>({} as PlanOption);

  const { member: customer } = useAppSelector(selectCustomer);

  const { member: leadDetails, uiState: leadDetailsUiState } = useAppSelector(selectLead);

  const { collection: serviceCost, uiState: serviceCostUiState } =
    useAppSelector(selectServiceCost);

  const frequencyColumns = 2;

  const [benefitExpand, setBenefitExpand] = React.useState<any>({});

  const HANDYMAN_HOURS = [1, 2, 3, 4, 5, 6, 7, 8];

  const [selectedHours, setSelectedHours] = useState(1);

  const updateLead = async (_leadDetails: LeadDetails) => {
    const existingServiceIds = _leadDetails?.subOrders?.map((subOrder) => subOrder.serviceId);
    const isNewlyAdded = existingServiceIds.indexOf(serviceId) < 0;
    const payload = {
      ..._leadDetails,
      subOrders: [..._leadDetails.subOrders],
    };
    if (isNewlyAdded) {
      payload.subOrders.push({
        ...({} as SubOrder),
        serviceId,
      });
    }
    const updatedSuborders = payload.subOrders.map((_subOrder) => {
      const subOrder = {
        ..._subOrder,
      };
      if (serviceId === LAWN_CARE_ID) {
        subOrder.area = payload.customerProfile.addresses[0].houseInfo?.lotSize || 0;
      } else if (serviceId === HOUSE_CLEANING_ID) {
        subOrder.bedrooms = payload.customerProfile.addresses[0].houseInfo?.bedrooms;
        subOrder.bathrooms = payload.customerProfile.addresses[0].houseInfo?.bathrooms;
      }
      if (subOrder.serviceId === serviceId) {
        if (!subOrder.servicePrice) {
          subOrder.servicePrice = {} as ServicePrice;
        }
        if (!subOrder.flags) {
          subOrder.flags = {} as Flags2;
        }
        subOrder.flags = {
          ...subOrder.flags,
          plan: selectedPlan?.label || 'STANDARD',
        };
        const cost = planOptions.filter((opt) => opt.selected)?.[0]?.cost;
        subOrder.servicePrice = {
          ...subOrder.servicePrice,
          cost: cost || 0,
        };
        if (selectedSubscriptionMethod.type === 'ONCE') {
          subOrder.flags = {
            ...subOrder.flags,
            recurringDuration: 'ONCE',
            hours: selectedHours,
            isRecurring: false,
          };
        } else {
          subOrder.flags = {
            ...subOrder.flags,
            recurringDuration: selectedSubscriptionMethod?.type,
            isRecurring: true,
          };
        }
      }
      return subOrder;
    });
    payload.subOrders = updatedSuborders;
    return dispatch(updateLeadAsync(payload));
  };

  useEffect(() => {
    if (serviceId) {
      if (serviceId === LAWN_CARE_ID) {
        const lotsize: number =
          leadDetails?.customerProfile?.addresses?.[0]?.houseInfo?.lotSize || 0;
        dispatch(
          getServiceCostAsync([
            {
              serviceId,
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
              serviceId,
              serviceParameters: {
                bedrooms: leadDetails?.customerProfile?.addresses?.[0]?.houseInfo?.bedrooms || 1,
                bathrooms: leadDetails?.customerProfile?.addresses?.[0]?.houseInfo?.bathrooms || 1,
              },
            },
          ])
        );
      } else if ([PEST_CONTROL_ID, POOL_CLEANING_ID, HANDYMAN_ID].includes(serviceId)) {
        dispatch(
          getServiceCostAsync([
            {
              serviceId,
              serviceParameters: {},
            },
          ])
        );
      }
    }
  }, [serviceId]);

  useEffect(() => {
    if (serviceCost.length > 0) {
      const isUpdate = mode === 'UPDATE';
      let subOrder = {} as SubOrder;
      if (isUpdate) {
        subOrder = leadDetails.subOrders.filter((so) => so.serviceId === serviceId)[0];
        setSelectedHours(subOrder?.flags?.hours || 1);
      }
      const subscriptionOptions: any[] = [];
      const priceMap: PriceMap[] = serviceCost;
      if (priceMap && priceMap[0]) {
        const pricePerWeekExists =
          priceMap[0].pricePerWeek && parseInt(priceMap[0].pricePerWeek) !== 0;
        const pricePer2WeeksExists =
          priceMap[0].pricePer2Weeks && parseInt(priceMap[0].pricePer2Weeks) !== 0;
        const pricePerMonthExists =
          priceMap[0].pricePerMonth && parseInt(priceMap[0].pricePerMonth) !== 0;
        const pricePerQuarterlyExists =
          priceMap[0].pricePerQuarterly && parseInt(priceMap[0].pricePerQuarterly) !== 0;

        if (pricePerWeekExists) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePerWeek,
            type: 'WEEKLY',
            label: 'Weekly',
            selected: false,
          });
        }
        if (pricePer2WeeksExists) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePer2Weeks,
            type: 'BIWEEKLY',
            label: 'Bi-Weekly',
            selected: false,
          });
        }
        if (pricePerMonthExists) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePerMonth,
            type: 'MONTHLY',
            label: 'Monthly',
            selected: false,
          });
        }
        if (pricePerQuarterlyExists) {
          subscriptionOptions.push({
            perCost: priceMap[0].pricePerQuarterly,
            type: 'QUARTERLY',
            label: 'Quarterly',
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
              if (subscriptionOptions[i].type === subOrder?.flags?.recurringDuration) {
                selectedIndex = i;
                subscriptionOptions[selectedIndex] = {
                  ...subscriptionOptions[selectedIndex],
                  selected: true,
                };
                setSelectedSubscriptionMethod(subscriptionOptions[selectedIndex]);
              }
            }
          } else {
            subscriptionOptions[0] = {
              ...subscriptionOptions[0],
              selected: true,
            };
            setSelectedSubscriptionMethod(subscriptionOptions[0]);
          }
        }

        if (priceMap[0].pricePerOnetime && parseInt(priceMap[0].pricePerOnetime) !== 0) {
          let option = {
            perCost: priceMap[0].pricePerOnetime,
            type: 'ONCE',
            label: 'One-Time',
            selected: isUpdate ? !subOrder?.flags.isRecurring : false,
          };

          setSelectedSubscriptionMethod(option);

          if (serviceId === HANDYMAN_ID) {
            option = {
              ...option,
              selected: true,
            };
          }
          subscriptionOptions.push(option);
        }
      }
      setSubscriptionMethodOptions(subscriptionOptions);
    }
  }, [serviceCost]);

  const { groupedServiceDetails } = getServiceDetails();

  useEffect(() => {
    if (Object.keys(selectedSubscriptionMethod).length > 0) {
      let preSelectedPlan = 'STANDARD';
      const isUpdate = mode === 'UPDATE';
      let selectedSuborder: SubOrder = {} as SubOrder;
      if (isUpdate) {
        selectedSuborder = leadDetails.subOrders.filter((so) => so.serviceId === serviceId)[0];
        preSelectedPlan = selectedSuborder.flags.plan;
      }
      const serviceCosts = serviceCost.filter(
        (cost) =>
          cost.serviceId === serviceId &&
          ['STANDARD', 'PREMIUM', 'FULL CARE'].indexOf(cost.plan) >= 0
      );
      const options: PlanOption[] = [];
      if (selectedSubscriptionMethod.type === 'WEEKLY') {
        for (const cost of serviceCosts) {
          const option: PlanOption = {
            label: cost.plan,
            benefits: groupedServiceDetails[serviceId].packageDescription[cost.plan] || [],
            cost: parseInt(cost.pricePerWeek),
            selected: preSelectedPlan === cost.plan,
          };
          options.push(option);
        }
      } else if (selectedSubscriptionMethod.type === 'BIWEEKLY') {
        for (const cost of serviceCosts) {
          const option = {
            label: cost.plan,
            benefits: groupedServiceDetails[serviceId].packageDescription[cost.plan] || [],
            cost: parseInt(cost.pricePer2Weeks),
            selected: preSelectedPlan === cost.plan,
          };
          options.push(option);
        }
      } else if (selectedSubscriptionMethod.type === 'MONTHLY') {
        for (const cost of serviceCosts) {
          const option = {
            label: cost.plan,
            benefits: groupedServiceDetails[serviceId].packageDescription[cost.plan] || [],
            cost: parseInt(cost.pricePerMonth),
            selected: preSelectedPlan === cost.plan,
          };
          options.push(option);
        }
      } else if (selectedSubscriptionMethod.type === 'QUARTERLY') {
        for (const cost of serviceCosts) {
          const option = {
            label: cost.plan,
            benefits: groupedServiceDetails[serviceId].packageDescription[cost.plan] || [],
            cost: parseInt(cost.pricePerQuarterly),
            selected: preSelectedPlan === cost.plan,
          };
          options.push(option);
        }
      } else if (selectedSubscriptionMethod.type === 'ONCE') {
        for (const cost of serviceCosts) {
          const option = {
            label: cost.plan,
            benefits: groupedServiceDetails[serviceId].packageDescription[cost.plan] || [],
            cost: parseInt(cost.pricePerOnetime),
            selected: preSelectedPlan === cost.plan,
          };
          options.push(option);
        }
      }
      setBackupPlanOptions(options);

      const _options = options.map((opt) => {
        if (opt.selected) {
          setSelectedPlan(opt);
          opt.cost =
            [HANDYMAN_ID].includes(serviceId) && selectedSuborder?.flags?.hours
              ? opt.cost * selectedSuborder.flags.hours
              : opt.cost;
        }
        return opt;
      });
      setPlanOptions(_options);
    }
  }, [selectedSubscriptionMethod]);

  return (
    <AppSafeAreaView
      loading={leadDetailsUiState === 'IN_PROGRESS' || serviceCostUiState === 'IN_PROGRESS'}
    >
      {/* <ScrollView> */}
      <VStack space={5} pt={5}>
        {[HANDYMAN_ID].includes(serviceId) ? (
          <>
            <Text textAlign="center" fontWeight="semibold" fontSize={18}>
              Choose Hours
            </Text>
            <HStack key="CHOOSE_HOURS" justifyContent="center" space={0} bg="#eee" p={3}>
              {HANDYMAN_HOURS.map((v, index) => (
                <Pressable
                  key={index}
                  borderRadius={5}
                  width="10%"
                  m={1}
                  p={2}
                  borderWidth={selectedHours === v ? 1 : 0}
                  borderColor={AppColors.TEAL}
                  bg={selectedHours === v ? AppColors.LIGHT_TEAL : '#fff'}
                  _pressed={{
                    borderColor: AppColors.TEAL,
                    borderWidth: 1,
                    backgroundColor: AppColors.LIGHT_TEAL,
                  }}
                  onPress={() => {
                    setSelectedHours(v);
                    let _selectedPlan = selectedPlan;
                    const plans = backupPlanOptions.map((opt) => {
                      if (opt.label === selectedPlan.label) {
                        opt = {
                          ...opt,
                          cost: opt.cost * v,
                        };
                        _selectedPlan = opt;
                      }
                      return opt;
                    });
                    setPlanOptions(plans);
                    setSelectedPlan(_selectedPlan);
                  }}
                >
                  <Text textAlign="center" color={AppColors.DARK_TEAL}>
                    {v}
                  </Text>
                </Pressable>
              ))}
            </HStack>
          </>
        ) : (
          <>
            <Text textAlign="center" fontWeight="semibold" fontSize={18}>
              Choose Frequency
            </Text>
            <HStack
              key="CHOOSE_FREQUENCY"
              justifyContent="center"
              alignItems="center"
              space={0}
              bg="#eee"
              p={3}
            >
              <FlatList
                data={subscriptionMethodOptions}
                numColumns={frequencyColumns}
                contentContainerStyle={{
                  alignSelf: 'center',
                  width: '100%',
                }}
                renderItem={({ index, item }) => (
                  <Pressable
                    key={index}
                    height={10}
                    borderRadius={5}
                    width="48%"
                    m={1}
                    p={2}
                    borderWidth={item.selected ? 1 : 0}
                    borderColor={AppColors.TEAL}
                    bg={item.selected ? AppColors.LIGHT_TEAL : '#fff'}
                    _pressed={{
                      borderColor: AppColors.TEAL,
                      borderWidth: 1,
                      backgroundColor: AppColors.LIGHT_TEAL,
                    }}
                    onPress={() => {
                      const updatedOptions = subscriptionMethodOptions.map((opt, i) => {
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
                      });
                      setSubscriptionMethodOptions(updatedOptions);
                    }}
                  >
                    <Text alignSelf="center" color={AppColors.TEAL} fontWeight="semibold">
                      {item.label}
                    </Text>
                  </Pressable>
                )}
              />
            </HStack>
          </>
        )}
        <Text textAlign="center" fontWeight="semibold" fontSize={18}>
          Choose Plan
        </Text>
        <HStack justifyContent="center" alignItems="center" space={0} bg="#eee" p={3} pb={200}>
          <FlatList
            data={planOptions}
            contentContainerStyle={{
              width: '100%',
              paddingBottom: 500,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ index, item }) => (
              <Pressable
                alignSelf="center"
                key={index}
                borderColor={AppColors.TEAL}
                bg={item.selected ? AppColors.LIGHT_TEAL : '#fff'}
                borderWidth={item.selected ? 1 : 0}
                minHeight={100}
                borderRadius={6}
                width="100%"
                m={1}
                p={3}
                _pressed={{
                  borderColor: AppColors.TEAL,
                  borderWidth: 1,
                  backgroundColor: AppColors.LIGHT_TEAL,
                }}
                onPress={() => {
                  const updatedOptions = planOptions.map((opt, i) => {
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
                <HStack justifyContent="space-between">
                  <VStack width="80%">
                    <Text color={AppColors.TEAL} fontSize={18} fontWeight="semibold">
                      {item.label}
                    </Text>
                    <Spacer borderWidth={0.5} my={1} borderColor="#eee" borderRadius={5} />
                    <VStack
                      py={2}
                      divider={<Divider thickness={0.6} mb={2} mt={2} bg={AppColors.CCC} />}
                    >
                      {item.benefits.map((b, i) => {
                        const hasDescription = !!(
                          (typeof b.description === 'string' ||
                            typeof b.description === 'object') &&
                          b.description.length > 0
                        );
                        return (
                          <VStack key={i}>
                            <Pressable
                              onPress={() => {
                                const payload = {
                                  ...benefitExpand,
                                  [serviceId]: {
                                    [b.title]: hasDescription
                                      ? benefitExpand?.[serviceId]?.[b.title] !== true
                                      : false,
                                  },
                                };
                                setBenefitExpand(payload);
                              }}
                            >
                              <HStack justifyContent="space-between" alignItems="center">
                                <HStack alignItems="center" space={1}>
                                  <SvgCss xml={CHECKBOX_TICK_ICON} height={14} />
                                  <Text
                                    color={AppColors.DARK_PRIMARY}
                                    fontSize={14}
                                    fontWeight="semibold"
                                  >
                                    {b.title}
                                  </Text>
                                </HStack>
                                {hasDescription && (
                                  <View px={3}>
                                    {!benefitExpand?.[serviceId]?.[b.title] ? (
                                      <SvgCss xml={PLUS_ICON(AppColors.TEAL)} height={9} />
                                    ) : (
                                      <Text
                                        color={AppColors.TEAL}
                                        fontSize={14}
                                        pr={2.5}
                                        fontWeight="semibold"
                                      >
                                        -
                                      </Text>
                                    )}
                                  </View>
                                )}
                              </HStack>
                            </Pressable>
                            {(hasDescription ? benefitExpand?.[serviceId]?.[b.title] : false) && (
                              <Text color={AppColors.DARK_PRIMARY} fontSize={12} pl={6} py={2}>
                                {b.description}
                              </Text>
                            )}
                          </VStack>
                        );
                      })}
                    </VStack>
                  </VStack>
                  <VStack
                    alignItems="center"
                    alignContent="center"
                    justifyContent="flex-start"
                    pr={5}
                  >
                    <Text color={AppColors.DARK_PRIMARY} fontSize={24} fontWeight="semibold">
                      ${item.cost}
                    </Text>
                    <Text color="#bbb" fontSize={12} fontWeight="semibold">
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
        loading={leadDetailsUiState === 'IN_PROGRESS' || serviceCostUiState === 'IN_PROGRESS'}
        subText="Please add required services"
        onPress={async () => {
          await updateLead(leadDetails);
          goBack();
        }}
      />
      {/* </ScrollView> */}
    </AppSafeAreaView>
  );
}

export default ChoosePlan;
