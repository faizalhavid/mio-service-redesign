import {
  Button,
  Divider,
  HStack,
  Pressable,
  ScrollView,
  Spacer,
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
  setActiveService,
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
import ServiceComboCard from "../../components/ServiceComboCard";

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
      <VStack mt={0} space={5}>
        <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
          Choose Service
        </Text>
        <ScrollView>
          <VStack
            space={2}
            bg={"#eee"}
            borderTopLeftRadius={10}
            borderTopRightRadius={10}
            height={900}
            pb={400}
            pt={3}
          >
            {[
              SERVICES[LAWN_CARE_ID],
              SERVICES[POOL_CLEANING_ID],
              SERVICES[HOUSE_CLEANING_ID],
              SERVICES[PEST_CONTROL_ID],
            ].map((service, index) => (
              <ServiceComboCard
                key={index}
                service={service}
                remove={true}
              ></ServiceComboCard>
            ))}
          </VStack>
        </ScrollView>
      </VStack>
      {/* <OrderSummary selectedServices={selectedServices} /> */}
      {/* <AddServiceBottomSheet
        toggleServiceInfo={toggleServiceInfo}
        status={
          selectedServiceInfo
            ? selectedServices.indexOf(selectedServiceInfo?.id) >= 0
            : false
        }
        setToggleServiceInfo={setToggleServiceInfo}
        chooseService={null}
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
      /> */}
      <Divider thickness={0} mt={20} />

      {/* {selectedServices.length !== 0 && ( */}
      <FooterButton
        type="SERVICE_SELECTION"
        minLabel="CHOOSE"
        maxLabel="SCHEDULE"
        disabled={selectedServices.length === 0}
        onPress={async () => {
          // const leadId = await StorageHelper.getValue("LEAD_ID");
          // if (!leadId) {
          //   await createLead();
          //   await StorageHelper.setValue("LEAD_ID", leadDetails.leadId);
          //   await updateLead();
          // } else {
          //   await updateLead();
          // }
          navigate("ChooseSchedule");
        }}
      />
      {/* )} */}
    </AppSafeAreaView>
  );
};

export default ChooseService;
