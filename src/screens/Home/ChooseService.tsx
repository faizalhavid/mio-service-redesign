import {
  Actionsheet,
  Button,
  Circle,
  Divider,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import {
  HOUSE_CLEANING,
  LAWN_CARE,
  PEST_CONTROL,
  POOL_CLEANING,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ServiceButton from "../../components/ServiceButton";
import { navigate } from "../../navigations/rootNavigation";
import { useMutation, useQuery } from "react-query";
import { getLead, getServices, postLead, putLead } from "../../services/order";
import { PriceMap, Service } from "../../commons/types";
import { CustomerProfile, useAuth } from "../../contexts/AuthContext";
import OrderSummary from "../../components/OrderSummary";
import AddServiceBottomSheet from "../../components/AddServiceBottomSheet";
import { putCustomer } from "../../services/customer";

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
    description:
      "Give your lawn the boost it needs without all of the work. Our providers will bring the best out of your yard.",
  },
  [POOL_CLEANING_ID]: {
    id: POOL_CLEANING_ID,
    icon: (color: string = "white") => POOL_CLEANING(color),
    text: POOL_CLEANING_TEXT,
    description: "Let our providers do the work while you relax poolside",
  },
  [HOUSE_CLEANING_ID]: {
    id: HOUSE_CLEANING_ID,
    icon: (color: string = "white") => HOUSE_CLEANING(color),
    text: HOUSE_CLEANING_TEXT,
    description:
      "The weekends weren't made for house cleaning. Our cleaning providers will make sure your home shines",
  },
  [PEST_CONTROL_ID]: {
    id: PEST_CONTROL_ID,
    icon: (color: string = "white") => PEST_CONTROL(color),
    text: PEST_CONTROL_TEXT,
    description:
      "Don't let bugs creep you out. Get a pest control treatment today",
  },
};

export type BathBedOptions = { number: number; selected: boolean };

const ChooseService = (): JSX.Element => {
  const [toggleServiceInfo, setToggleServiceInfo] = React.useState(false);

  const [selectedServiceInfo, setSelectedServiceInfo] =
    React.useState<ServicesType>();

  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  // const [summaryHeight, setSummaryHeight] = React.useState<number>(75);

  const [loading, setLoading] = React.useState(false);
  const { leadDetails, setLeadDetails, customerProfile, setCustomerProfile } =
    useAuth();
  const [services, setServices] = React.useState<Service[]>([{} as Service]);

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

  const getLeadMutation = useMutation(
    "getLeadById",
    (leadId: string) => {
      setLoading(true);
      return getLead(leadId);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setLeadDetails(data.data);
        let _selectedServices: string[] = [];
        data.data.subOrders.forEach((subOrder: any) => {
          _selectedServices.push(subOrder.serviceId);
        });
        setSelectedServices(_selectedServices);
      },
      onError: (err) => {
        setLoading(false);
        console.log(err);
      },
    }
  );

  const fetchLead = React.useCallback(async () => {
    let leadId = await AsyncStorage.getItem("LEAD_ID");
    if (leadId) {
      await getLeadMutation.mutateAsync(leadId);
    }
  }, []);

  React.useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  const createLeadMutation = useMutation(
    "createLead",
    (data) => {
      setLoading(true);
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
      return postLead(payload);
    },
    {
      onSuccess: async (data) => {
        setLoading(false);
        setLeadDetails(data.data);
        await AsyncStorage.setItem("LEAD_ID", data.data.leadId);
      },
      onError: (err) => {
        setLoading(false);
        console.log(err);
      },
    }
  );

  const updateLeadMutation = useMutation(
    "updateLead",
    (data) => {
      setLoading(true);
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

  const putAddressMutation = useMutation(
    "putAddressMutation",
    (data: CustomerProfile): any => {
      setLoading(true);
      return putCustomer(data);
    },
    {
      onSuccess: async (data: any) => {
        setLoading(false);
        setCustomerProfile(data.data);
      },
      onError: (err: any) => {
        setLoading(false);
        console.log(err);
      },
    }
  );

  const chooseService = async (
    serviceId: string = "",
    fromBottomSheet: boolean = false
  ) => {
    let pos = selectedServices.indexOf(serviceId);
    if (~pos) {
      selectedServices.splice(pos, 1);
      setSelectedServices([...selectedServices]);
      return;
    }

    if (fromBottomSheet) {
      if (propertyDetailsNeeded) {
        let houseInfo = {
          ...customerProfile.addresses[0].houseInfo,
        };
        if (serviceId === LAWN_CARE_ID) {
          houseInfo = {
            ...houseInfo,
            lotSize: selectedArea,
          };
          putAddressMutation.mutate({
            ...customerProfile,
            addresses: [
              {
                ...customerProfile.addresses[0],
                houseInfo,
              },
            ],
          });
        } else if (serviceId === HOUSE_CLEANING_ID) {
          // console.log(selectedBedroomNo, selectedBathroomNo);
          houseInfo = {
            ...houseInfo,
            bedrooms: selectedBedroomNo,
            bathrooms: selectedBathroomNo,
          };
          putAddressMutation.mutate({
            ...customerProfile,
            addresses: [
              {
                ...customerProfile.addresses[0],
                houseInfo,
              },
            ],
          });
        }
      }
    } else {
      let isNeeded = await checkNeedForPropertyDetails(serviceId);

      if (isNeeded) {
        setPropertyDetailsNeeded(true);
        toggleServiceInfoSheet(serviceId);
        return;
      }
    }
    setSelectedServices([...selectedServices, serviceId]);
  };

  const checkNeedForPropertyDetails = async (serviceId: string) => {
    return new Promise((resolve, reject) => {
      try {
        if (services.length > 0 && serviceId === LAWN_CARE_ID) {
          setLoading(true);
          let hasArea = false;
          for (const service of services) {
            if (service.serviceId === LAWN_CARE_ID) {
              if (customerProfile.addresses[0].houseInfo?.lotSize) {
                let priceMap: PriceMap[] = [];
                let lotsize: number =
                  customerProfile.addresses[0].houseInfo?.lotSize;
                for (const price of service.priceMap) {
                  if (
                    price.rangeMin &&
                    price.rangeMax &&
                    lotsize &&
                    lotsize > price.rangeMin &&
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
        } else if (services.length > 0 && serviceId === HOUSE_CLEANING_ID) {
          setBathroomOptions([]);
          setBedroomOptions([]);
          let houseInfo = customerProfile?.addresses[0]?.houseInfo;
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
      } finally {
        setLoading(false);
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
    <AppSafeAreaView loading={loading}>
      <ScrollView>
        <>
          <VStack mt={5} space={5}>
            <Text textAlign={"center"} fontSize={20}>
              Which services are {"\n"} you interested in?
            </Text>
            <VStack space={0}>
              <HStack justifyContent="center" space={5}>
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
              </HStack>
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
      <FooterButton
        label="ADD SERVICE DETAILS"
        disabled={selectedServices.length === 0}
        subText="Please add required services"
        onPress={async () => {
          const leadId = await AsyncStorage.getItem("LEAD_ID");
          if (!leadId) {
            await createLeadMutation.mutateAsync();
            await updateLeadMutation.mutateAsync();
          } else {
            await updateLeadMutation.mutateAsync();
          }
          navigate("ServiceDetails");
        }}
      />
    </AppSafeAreaView>
  );
};

export default ChooseService;
