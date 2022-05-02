import { Text, VStack } from "native-base";
import React from "react";
import { ScrollView } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import ServiceComboCard from "../../components/ServiceComboCard";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSelectedServices } from "../../slices/service-slice";
import { SERVICES } from "./ChooseService";

const ChooseSchedule = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const { collection: selectedServices } = useAppSelector(
    selectSelectedServices
  );
  return (
    <AppSafeAreaView loading={false}>
      <VStack mt={0} space={5}>
        <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
          Choose Schedule
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
            {selectedServices.map((service, index) => (
              <ServiceComboCard
                key={index}
                service={SERVICES[service]}
                datetime={true}
              ></ServiceComboCard>
            ))}
          </VStack>
        </ScrollView>
      </VStack>
      <FooterButton
        type="SCHEDULE_SELECTION"
        minLabel="VIEW"
        maxLabel="SUMMARY"
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
          //   navigate("ChooseSchedule");
        }}
      />
    </AppSafeAreaView>
  );
};

export default ChooseSchedule;
