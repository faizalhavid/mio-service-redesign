import { Divider, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import {
  HOUSE_CLEANING,
  LAWN_CARE,
  PEST_CONTROL,
  POOL_CLEANING,
} from "../../commons/assets";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { navigate } from "../../navigations/rootNavigation";
import { StorageHelper } from "../../services/storage-helper";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCustomer } from "../../slices/customer-slice";
import {
  selectSelectedServices,
  selectServices,
  updateSelectedServices,
} from "../../slices/service-slice";
import { getLeadAsync, selectLead } from "../../slices/lead-slice";
import { IN_PROGRESS } from "../../commons/ui-states";
import ServiceComboCard from "../../components/ServiceComboCard";
import { SubOrder } from "../../commons/types";
import {
  selectSelectedAddress,
  setSelectedAddress,
} from "../../slices/shared-slice";

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
  const dispatch = useAppDispatch();
  const { uiState: customerUiState } = useAppSelector(selectCustomer);
  const { collection: selectedServices } = useAppSelector(
    selectSelectedServices
  );
  const { uiState: servicesUiState } = useAppSelector(selectServices);
  const { uiState: leadUiState, member: leadDetails } =
    useAppSelector(selectLead);

  const fetchLead = React.useCallback(async () => {
    // await StorageHelper.removeValue("LEAD_ID");
    let leadId = await StorageHelper.getValue("LEAD_ID");
    if (leadId) {
      dispatch(getLeadAsync({ leadId })).then((_leadDetails) => {
        _leadDetails.payload.subOrders.forEach((subOrder: any) => {
          dispatch(
            updateSelectedServices({ selectedService: subOrder.serviceId })
          );
        });
      });
    }
  }, []);

  React.useEffect(() => {
    fetchLead();
  }, [fetchLead]);

  return (
    <AppSafeAreaView
      loading={
        [leadUiState, customerUiState, servicesUiState].indexOf(IN_PROGRESS) >=
        0
      }
    >
      <VStack mt={"1/5"} space={5}>
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
            mb={100}
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
      <Divider thickness={0} mt={20} />
      <FooterButton
        type="SERVICE_SELECTION"
        minLabel="CHOOSE"
        maxLabel="SCHEDULE"
        disabled={selectedServices.length === 0}
        onPress={async () => {
          navigate("ChooseSchedule");
        }}
      />
    </AppSafeAreaView>
  );
};

export default ChooseService;
