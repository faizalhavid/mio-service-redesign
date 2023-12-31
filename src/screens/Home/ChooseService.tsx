import { Divider, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import {
  HANDYMAN,
  HOUSE_CLEANING,
  LAWN_CARE,
  PEST_CONTROL,
  POOL_CLEANING,
} from '../../commons/assets';
import { IN_PROGRESS } from '../../commons/ui-states';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import FooterButton from '../../components/FooterButton';
import ServiceComboCard from '../../components/ServiceComboCard';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAppSelector } from '../../hooks/useAppSelector';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { navigate } from '../../navigations/rootNavigation';
import { StorageHelper } from '../../services/storage-helper';
import { isNonNull } from '../../services/utils';
import { selectCustomer } from '../../slices/customer-slice';
import { createLeadAsync, getLeadAsync, selectLead } from '../../slices/lead-slice';
import { selectServices } from '../../slices/service-slice';

export const LAWN_CARE_ID: string = 'lawnCare';
export const POOL_CLEANING_ID: string = 'poolCleaning';
export const HOUSE_CLEANING_ID: string = 'houseCleaning';
export const PEST_CONTROL_ID: string = 'pestControl';
export const HANDYMAN_ID: string = 'handyman';

const LAWN_CARE_TEXT: string = 'Lawn Care';
const POOL_CLEANING_TEXT: string = 'Pool Cleaning';
const HOUSE_CLEANING_TEXT: string = 'House Cleaning';
const PEST_CONTROL_TEXT: string = 'Pest Control';
const HANDYMAN_TEXT: string = 'Handyman';

export type ServicesType = {
  id: string;
  icon: (color?: string) => string;
  text: string;
  description: string;
};

export const SERVICES: { [key: string]: ServicesType } = {
  [LAWN_CARE_ID]: {
    id: LAWN_CARE_ID,
    icon: (color: string = 'white') => LAWN_CARE(color),
    text: LAWN_CARE_TEXT,
    description: '',
  },
  [POOL_CLEANING_ID]: {
    id: POOL_CLEANING_ID,
    icon: (color: string = 'white') => POOL_CLEANING(color),
    text: POOL_CLEANING_TEXT,
    description: '',
  },
  [HOUSE_CLEANING_ID]: {
    id: HOUSE_CLEANING_ID,
    icon: (color: string = 'white') => HOUSE_CLEANING(color),
    text: HOUSE_CLEANING_TEXT,
    description: '',
  },
  [PEST_CONTROL_ID]: {
    id: PEST_CONTROL_ID,
    icon: (color: string = 'white') => PEST_CONTROL(color),
    text: PEST_CONTROL_TEXT,
    description: '',
  },
  [HANDYMAN_ID]: {
    id: HANDYMAN_ID,
    icon: (color: string = 'white') => HANDYMAN(color),
    text: HANDYMAN_TEXT,
    description: '',
  },
};

export type BathBedOptions = { number: number; selected: boolean };

function ChooseService(): JSX.Element {
  const dispatch = useAppDispatch();
  const { member: customer, uiState: customerUiState } = useAppSelector(selectCustomer);

  const { uiState: servicesUiState } = useAppSelector(selectServices);
  const { uiState: leadUiState, member: leadDetails } = useAppSelector(selectLead);

  const isAuthenticated = useAuthenticatedUser();

  const createLead = async () => {
    const leadId = await StorageHelper.getValue('LEAD_ID');
    let lead = leadDetails;
    if (leadId) {
      lead = await dispatch(getLeadAsync({ leadId })).unwrap();
    } else {
      if (isAuthenticated) {
        lead = await dispatch(
          createLeadAsync({
            ...leadDetails,
            customerProfile: {
              ...leadDetails.customerProfile,
              ...customer,
              addresses: [...customer?.addresses?.filter((address) => address.isPrimary)],
            },
          })
        ).unwrap();
      } else {
        const addresses = await StorageHelper.getValue('LOCAL_ADDRESS');
        lead = await dispatch(
          createLeadAsync({
            ...leadDetails,
            customerProfile: addresses
              ? {
                  addresses: [JSON.parse(addresses)],
                }
              : {},
          })
        ).unwrap();
      }

      StorageHelper.setValue('LEAD_ID', lead.leadId);
    }
    return lead;
  };

  const [oneTimeSetupCompleted, setOneTimeSetupCompleted] = useState<boolean>(false);

  useEffect(() => {
    if (
      isNonNull(isAuthenticated) &&
      ((customer && customer?.customerId && !oneTimeSetupCompleted) || !isAuthenticated)
    ) {
      createLead();
      setOneTimeSetupCompleted(true);
    }
  }, [customer, isAuthenticated]);

  return (
    <AppSafeAreaView
      loading={[leadUiState, customerUiState, servicesUiState].indexOf(IN_PROGRESS) >= 0}
    >
      <VStack space={5} pt={5}>
        <Text textAlign="center" fontWeight="semibold" fontSize={18}>
          Choose Service
        </Text>
        <ScrollView>
          <VStack
            space={2}
            bg="#eee"
            borderTopLeftRadius={10}
            borderTopRightRadius={10}
            height={900}
            mb={100}
            pt={3}
          >
            <Text px={3} fontWeight="semibold">
              Recurring Services
            </Text>
            <VStack space={2}>
              {[
                SERVICES[LAWN_CARE_ID],
                SERVICES[POOL_CLEANING_ID],
                SERVICES[HOUSE_CLEANING_ID],
                SERVICES[PEST_CONTROL_ID],
              ].map((service, index) => (
                <ServiceComboCard key={index} service={service} remove />
              ))}
            </VStack>
            <Text px={3} fontWeight="semibold">
              One-Time Services
            </Text>
            <VStack space={2}>
              {[SERVICES[HANDYMAN_ID]].map((service, index) => (
                <ServiceComboCard key={index} service={service} remove />
              ))}
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
      <Divider thickness={0} mt={20} />
      <FooterButton
        type="SERVICE_SELECTION"
        minLabel="CHOOSE"
        maxLabel="SCHEDULE"
        disabled={leadDetails?.subOrders?.length === 0}
        onPress={async () => {
          navigate('ChooseSchedule');
        }}
      />
    </AppSafeAreaView>
  );
}

export default ChooseService;
