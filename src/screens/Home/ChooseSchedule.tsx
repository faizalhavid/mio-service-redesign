import { Divider, Text, VStack } from "native-base";
import React from "react";
import { ScrollView } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import ServiceComboCard from "../../components/ServiceComboCard";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { navigate } from "../../navigations/rootNavigation";
import { selectCustomer } from "../../slices/customer-slice";
import { selectLead, updateLeadAsync } from "../../slices/lead-slice";
import { SERVICES } from "./ChooseService";

function ChooseSchedule(): JSX.Element {
  const dispatch = useAppDispatch();

  const { member: leadDetails, uiState: leadDetailsUiState } =
    useAppSelector(selectLead);
  const { member: customer } = useAppSelector(selectCustomer);

  const isAllFieldsFilled: boolean = React.useMemo(() => {
    if (!leadDetails || Object.keys(leadDetails).length === 0) {
      return false;
    }
    if (leadDetails.subOrders.length > 0) {
      for (const subOrder of leadDetails.subOrders) {
        if (!subOrder?.appointmentInfo?.appointmentDateTime) {
          return false;
        }
      }
    }
    return true;
  }, [leadDetails]);

  return (
    <AppSafeAreaView loading={leadDetailsUiState === "IN_PROGRESS"}>
      <VStack mt="1/5" space={5}>
        <Text textAlign="center" fontWeight="semibold" fontSize={18}>
          Choose Schedule
        </Text>
        <ScrollView>
          <VStack
            space={2}
            bg="#eee"
            borderTopLeftRadius={10}
            borderTopRightRadius={10}
            height={900}
            mb={250}
            pt={3}
          >
            {leadDetails?.subOrders?.map((service, index) => (
              <ServiceComboCard
                key={index}
                service={SERVICES[service.serviceId]}
                datetime
               />
            ))}
          </VStack>
        </ScrollView>
      </VStack>
      <Divider thickness={0} mt={20} />
      <FooterButton
        type="SCHEDULE_SELECTION"
        minLabel="VIEW"
        maxLabel="SUMMARY"
        loading={leadDetailsUiState === "IN_PROGRESS"}
        disabled={!isAllFieldsFilled}
        onPress={async () => {
          if (!leadDetails?.customerProfile?.customerId) {
            await dispatch(
              updateLeadAsync({
                ...leadDetails,
                customerProfile: {
                  ...customer,
                  addresses: leadDetails.customerProfile.addresses,
                },
              })
            );
          }
          navigate("Payment");
        }}
      />
    </AppSafeAreaView>
  );
}

export default ChooseSchedule;
