import {
  Button,
  Divider,
  HStack,
  Pressable,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import {
  FILLED_CIRCLE_ICON,
  HOUSE_CLEANING,
  LAWN_CARE,
  PEST_CONTROL,
  POOL_CLEANING,
  STAR_ICON,
} from "../../commons/assets";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import ServiceButton from "../../components/ServiceButton";
import { navigate } from "../../navigations/rootNavigation";
import { PriceMap } from "../../commons/types";
import AddServiceBottomSheet from "../../components/AddServiceBottomSheet";
import { StorageHelper } from "../../services/storage-helper";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { putCustomerAsync, selectCustomer } from "../../slices/customer-slice";
import {
  getServicesAsync,
  selectSelectedServices,
  selectServices,
  updateSelectedServices,
} from "../../slices/service-slice";
import {
  createLeadAsync,
  getLeadAsync,
  selectLead,
  updateLeadAsync,
} from "../../slices/lead-slice";
import { IN_PROGRESS } from "../../commons/ui-states";
import { AppColors } from "../../commons/colors";
import { SvgCss } from "react-native-svg";

export const LAWN_CARE_ID: string = "lawnCare";
export const POOL_CLEANING_ID: string = "poolCleaning";
export const HOUSE_CLEANING_ID: string = "houseCleaning";
export const PEST_CONTROL_ID: string = "pestControl";

const LAWN_CARE_TEXT: string = "Lawn Care";
const POOL_CLEANING_TEXT: string = "Pool Cleaning";
const HOUSE_CLEANING_TEXT: string = "House Cleaning";
const PEST_CONTROL_TEXT: string = "Pest Control";

export type ServicesType = {
  id: string;
  icon: (color?: string) => string;
  text: string;
  description: string;
};

export const SERVICES: { [key: string]: ServicesType } = {
  [LAWN_CARE_ID]: {
    id: LAWN_CARE_ID,
    icon: (color: string = "white") => LAWN_CARE(color),
    text: LAWN_CARE_TEXT,
    description: "",
  },
  [POOL_CLEANING_ID]: {
    id: POOL_CLEANING_ID,
    icon: (color: string = "white") => POOL_CLEANING(color),
    text: POOL_CLEANING_TEXT,
    description: "",
  },
  [HOUSE_CLEANING_ID]: {
    id: HOUSE_CLEANING_ID,
    icon: (color: string = "white") => HOUSE_CLEANING(color),
    text: HOUSE_CLEANING_TEXT,
    description: "",
  },
  [PEST_CONTROL_ID]: {
    id: PEST_CONTROL_ID,
    icon: (color: string = "white") => PEST_CONTROL(color),
    text: PEST_CONTROL_TEXT,
    description: "",
  },
};

export type BathBedOptions = { number: number; selected: boolean };

const ChooseService = (): JSX.Element => {
  const [toggleServiceInfo, setToggleServiceInfo] = React.useState(false);

  const [selectedServiceInfo, setSelectedServiceInfo] =
    React.useState<ServicesType>();

  // const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  // const [summaryHeight, setSummaryHeight] = React.useState<number>(75);

  const dispatch = useAppDispatch();
  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);
  const { collection: selectedServices } = useAppSelector(
    selectSelectedServices
  );
  const {
    uiState: servicesUiState,
    collection: allServices,
    error: serviceError,
  } = useAppSelector(selectServices);
  const {
    uiState: leadUiState,
    member: leadDetails,
    error: leadError,
  } = useAppSelector(selectLead);

  const [selectedArea, setSelectedArea] = React.useState<number>(0);
  const [selectedBathroomNo, setSelectedBathroomNo] = React.useState<number>(0);
  const [selectedBedroomNo, setSelectedBedroomNo] = React.useState<number>(0);
  const [areaOptions, setAreaOptions] = React.useState<PriceMap[]>([]);
  const [propertyDetailsNeeded, setPropertyDetailsNeeded] =
    React.useState<boolean>(false);
  const [bathroomOptions, setBathroomOptions] = React.useState<
    BathBedOptions[]
  >([]);
  const [bedroomOptions, setBedroomOptions] = React.useState<BathBedOptions[]>(
    []
  );

  useEffect(() => {
    // dispatch(getServicesAsync()).then(() => {
    //   for (let service of allServices) {
    //     SERVICES[service.serviceId].description = service.description;
    //   }
    // });
  }, []);

  const fetchLead = React.useCallback(async () => {
    let leadId = await StorageHelper.getValue("LEAD_ID");
    if (leadId) {
      dispatch(getLeadAsync({ leadId })).then(() => {
        let _selectedServices: string[] = [];
        leadDetails.subOrders.forEach((subOrder: any) => {
          _selectedServices.push(subOrder.serviceId);
        });
        // updateSelectedServices(_selectedServices);
      });
    }
  }, []);

  React.useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const createLead = async () => {
    let payload = {
      subOrders: [
        ...selectedServices.map((serviceId) => {
          if (serviceId === LAWN_CARE_ID) {
            return {
              area: selectedArea,
              serviceId,
            };
          } else if (serviceId === HOUSE_CLEANING_ID) {
            return {
              bedrooms: selectedBedroomNo,
              bathrooms: selectedBathroomNo,
              serviceId,
            };
          }
          return { serviceId };
        }),
      ],
    };
    return dispatch(createLeadAsync(payload));
  };

  const updateLead = async () => {
    let existingServiceIds = leadDetails.subOrders.map(
      (subOrder) => subOrder.serviceId
    );
    let newlyAddedServiceIds = selectedServices.filter(
      (serviceId) => !existingServiceIds.includes(serviceId)
    );
    let subOrders = leadDetails.subOrders.filter((subOrder) => {
      return selectedServices.includes(subOrder.serviceId);
    });
    let payload = {
      ...leadDetails,
      subOrders: [
        ...subOrders,
        ...newlyAddedServiceIds.map((serviceId) => {
          if (serviceId === LAWN_CARE_ID) {
            return { serviceId, area: String(selectedArea) };
          } else if (serviceId === HOUSE_CLEANING_ID) {
            return {
              serviceId,
              bedrooms: String(selectedBedroomNo),
              bathrooms: String(selectedBathroomNo),
            };
          }
          return { serviceId };
        }),
      ],
    };
    return dispatch(updateLeadAsync(payload));
  };

  const chooseService = async (
    serviceId: string = "",
    fromBottomSheet: boolean = false
  ) => {
    dispatch(updateSelectedServices({ selectedService: serviceId }));

    // if (fromBottomSheet) {
    //   if (propertyDetailsNeeded) {
    //     let houseInfo = {
    //       ...customer.addresses[0].houseInfo,
    //     };
    //     if (serviceId === LAWN_CARE_ID) {
    //       houseInfo = {
    //         ...houseInfo,
    //         lotSize: selectedArea,
    //       };
    //       dispatch(
    //         putCustomerAsync({
    //           ...customer,
    //           addresses: [
    //             {
    //               ...customer.addresses[0],
    //               houseInfo,
    //             },
    //           ],
    //         })
    //       );
    //     } else if (serviceId === HOUSE_CLEANING_ID) {
    //       // console.log(selectedBedroomNo, selectedBathroomNo);
    //       houseInfo = {
    //         ...houseInfo,
    //         bedrooms: selectedBedroomNo,
    //         bathrooms: selectedBathroomNo,
    //       };
    //       dispatch(
    //         putCustomerAsync({
    //           ...customer,
    //           addresses: [
    //             {
    //               ...customer.addresses[0],
    //               houseInfo,
    //             },
    //           ],
    //         })
    //       );
    //     }
    //   }
    // } else {
    //   let isNeeded = await checkNeedForPropertyDetails(serviceId);

    //   if (isNeeded) {
    //     setPropertyDetailsNeeded(true);
    //     toggleServiceInfoSheet(serviceId);
    //     return;
    //   }
    // }
  };

  const checkNeedForPropertyDetails = async (serviceId: string) => {
    return new Promise((resolve, reject) => {
      try {
        if (allServices.length > 0 && serviceId === LAWN_CARE_ID) {
          let hasArea = false;
          for (const service of allServices) {
            if (service.serviceId === LAWN_CARE_ID) {
              if (customer.addresses[0].houseInfo?.lotSize) {
                let priceMap: PriceMap[] = [];
                let lotsize: number = customer.addresses[0].houseInfo?.lotSize;
                console.log(lotsize);
                for (const price of service.priceMap) {
                  if (
                    lotsize &&
                    price.rangeMin !== undefined &&
                    price.rangeMin !== null &&
                    lotsize > price.rangeMin &&
                    price.rangeMax !== undefined &&
                    price.rangeMax !== null &&
                    lotsize < price.rangeMax
                  ) {
                    hasArea = true;
                    setSelectedArea(lotsize);
                    priceMap.push({
                      ...price,
                      selected: hasArea,
                    });
                  } else {
                    priceMap.push(price);
                  }
                }
                setAreaOptions(priceMap);
              } else {
                setAreaOptions(service.priceMap);
              }
              break;
            }
          }
          if (!hasArea) {
            resolve(true);
            return;
          } else {
            resolve(false);
            return;
          }
        } else if (allServices.length > 0 && serviceId === HOUSE_CLEANING_ID) {
          setBathroomOptions([]);
          setBedroomOptions([]);
          let houseInfo = customer?.addresses[0]?.houseInfo;
          // console.log(houseInfo);
          let bathOptions: BathBedOptions[] = [];
          let bedOptions: BathBedOptions[] = [];
          let hasBath = false;
          let hasBed = false;
          for (let i of [1, 2, 3, 4, 5]) {
            let _bathRoomNo: number =
              houseInfo && houseInfo?.bathrooms && houseInfo?.bathrooms === i
                ? houseInfo?.bathrooms
                : 0;
            if (_bathRoomNo === i) {
              setSelectedBathroomNo(_bathRoomNo);
              hasBath = true;
            }
            bathOptions.push({
              number: i,
              selected: _bathRoomNo === i,
            });

            let _bedRoomNo: number =
              houseInfo && houseInfo?.bedrooms && houseInfo?.bedrooms === i
                ? houseInfo?.bedrooms
                : 0;
            if (_bedRoomNo === i) {
              setSelectedBedroomNo(_bedRoomNo);
              hasBed = true;
            }
            bedOptions.push({
              number: i,
              selected: _bedRoomNo === i,
            });
          }
          setBathroomOptions(bathOptions);
          setBedroomOptions(bedOptions);
          if (!hasBath || !hasBed) {
            resolve(true);
            return;
          } else {
            resolve(false);
            return;
          }
        } else {
          resolve(false);
        }
      } catch (error) {
        resolve(false);
        console.log(error);
      }
    });
  };

  const showServiceInfo = async (serviceId: string) => {
    let isNeeded = await checkNeedForPropertyDetails(serviceId);
    if (isNeeded) {
      setPropertyDetailsNeeded(true);
    } else {
      setPropertyDetailsNeeded(false);
    }
    toggleServiceInfoSheet(serviceId);
  };

  const toggleServiceInfoSheet = (serviceId: string) => {
    setSelectedServiceInfo(SERVICES[serviceId]);
    setToggleServiceInfo(true);
  };

  return (
    <AppSafeAreaView
      loading={
        [leadUiState, customerUiState, servicesUiState].indexOf(IN_PROGRESS) > 0
      }
    >
      <ScrollView>
        <>
          <VStack mt={0} space={5}>
            <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
              Choose Service
            </Text>
            <VStack
              space={0}
              bg={"#eee"}
              borderTopLeftRadius={10}
              borderTopRightRadius={10}
              pb={100}
            >
              {[
                SERVICES[LAWN_CARE_ID],
                SERVICES[POOL_CLEANING_ID],
                SERVICES[HOUSE_CLEANING_ID],
                SERVICES[PEST_CONTROL_ID],
              ].map((service, index) => (
                <HStack
                  key={index}
                  bg={"#fff"}
                  alignContent={"space-between"}
                  justifyContent={"space-between"}
                  width={"95%"}
                  alignSelf="center"
                  borderRadius={10}
                  borderColor={AppColors.DARK_PRIMARY}
                  borderWidth={
                    selectedServices.indexOf(service?.id) >= 0 ? 1 : 0
                  }
                  p={5}
                  mx={5}
                  mt={3}
                >
                  <VStack space={1}>
                    <Text color={AppColors.DARK_TEAL} fontWeight={"semibold"}>
                      {service?.text}
                    </Text>
                    <HStack
                      justifyContent={"center"}
                      alignItems="center"
                      space={1}
                    >
                      <SvgCss
                        xml={FILLED_CIRCLE_ICON("#ccc")}
                        width={4}
                        height={4}
                      />
                      <Text color={"#aaa"}>120 Mins </Text>
                      <SvgCss
                        xml={FILLED_CIRCLE_ICON("#ccc")}
                        width={4}
                        height={4}
                      />
                      <Text color={"#aaa"}>4.9</Text>

                      <SvgCss xml={STAR_ICON("#ccc")} width={15} height={15} />
                    </HStack>
                    <Text
                      color={AppColors.DARK_PRIMARY}
                      fontWeight={"semibold"}
                    >
                      Starts at $45
                    </Text>
                  </VStack>
                  <Pressable
                    borderColor={AppColors.TEAL}
                    height={8}
                    borderRadius={5}
                    width={50}
                    justifyContent="center"
                    borderWidth={1}
                    onPress={() => {
                      console.log("add", service?.id);
                      // dispatch(
                      //   updateSelectedServices({
                      //     metadata: { selectedServices: [service?.id] },
                      //   })
                      // );
                      chooseService(service?.id);
                    }}
                    _pressed={{
                      backgroundColor: AppColors.PRIMARY,
                    }}
                  >
                    <Text
                      alignSelf={"center"}
                      color={AppColors.TEAL}
                      fontWeight={"semibold"}
                    >
                      Add
                    </Text>
                  </Pressable>
                </HStack>
              ))}
              {/* <HStack justifyContent="center" space={5}>
                {[SERVICES[LAWN_CARE_ID], SERVICES[POOL_CLEANING_ID]].map(
                  (service, index) => (
                    <ServiceButton
                      key={index}
                      icon={service?.icon()}
                      text={service?.text}
                      status={selectedServices.indexOf(service?.id) >= 0}
                      onAdd={() => chooseService(service?.id)}
                      onPress={() => showServiceInfo(service?.id)}
                    />
                  )
                )}
              </HStack>
              <HStack justifyContent="center" space={5}>
                {[SERVICES[HOUSE_CLEANING_ID], SERVICES[PEST_CONTROL_ID]].map(
                  (service, index) => (
                    <ServiceButton
                      key={index}
                      icon={service?.icon()}
                      text={service?.text}
                      status={selectedServices.indexOf(service?.id) >= 0}
                      onAdd={() => chooseService(service?.id)}
                      onPress={() => showServiceInfo(service?.id)}
                    />
                  )
                )}
              </HStack> */}
            </VStack>
          </VStack>
          {/* <OrderSummary selectedServices={selectedServices} /> */}
          <AddServiceBottomSheet
            toggleServiceInfo={toggleServiceInfo}
            status={
              selectedServiceInfo
                ? selectedServices.indexOf(selectedServiceInfo?.id) >= 0
                : false
            }
            setToggleServiceInfo={setToggleServiceInfo}
            chooseService={chooseService}
            selectedServiceInfo={selectedServiceInfo}
            propertyDetailsNeeded={propertyDetailsNeeded}
            // Area
            areaOptions={areaOptions}
            setAreaOptions={setAreaOptions}
            setSelectedArea={setSelectedArea}
            // Bedroom
            bedroomOptions={bedroomOptions}
            setBedroomOptions={setBedroomOptions}
            setSelectedBathroomNo={setSelectedBathroomNo}
            // Bathroom
            bathroomOptions={bathroomOptions}
            setBathroomOptions={setBathroomOptions}
            setSelectedBedroomNo={setSelectedBedroomNo}
          />
          <Divider thickness={0} mt={20} />
        </>
      </ScrollView>
      {/* {selectedServices.length !== 0 && ( */}
      <FooterButton
        label="ADD SERVICE DETAILS"
        disabled={selectedServices.length === 0}
        v2={true}
        subText="Please add required services"
        onPress={async () => {
          const leadId = await StorageHelper.getValue("LEAD_ID");
          if (!leadId) {
            await createLead();
            await StorageHelper.setValue("LEAD_ID", leadDetails.leadId);
            await updateLead();
          } else {
            await updateLead();
          }
          navigate("ServiceDetails");
        }}
      />
      {/* )} */}
    </AppSafeAreaView>
  );
};

export default ChooseService;
