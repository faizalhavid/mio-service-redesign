import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Center,
  CheckIcon,
  Divider,
  Flex,
  HStack,
  ScrollView,
  Select,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ChooseServiceDetailsButton from "../../components/ChooseServiceDetailsButton";
import FooterButton from "../../components/FooterButton";
import OrderSummary from "../../components/OrderSummary";
import ServiceDetailsOptions from "../../components/ServiceDetailsOptions";
import ServiceDetailsSection from "../../components/ServiceDetailsSection";
import { SuperRootStackParamList } from "../../navigations";
import { navigate } from "../../navigations/rootNavigation";
import EditServiceInfo from "./EditServiceDetails";

type ServiceDetailsProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "ServiceDetails"
>;
const ServiceDetails = ({ route }: ServiceDetailsProps): JSX.Element => {
  const { mode } = route.params;
  const [isPreview, setIsPreview] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [showServiceDesc, setShowServiceDesc] = React.useState(false);

  React.useEffect(() => {
    if (mode) {
      setIsPreview(mode === "PREVIEW");
      setIsEdit(mode === "EDIT");
    }
  }, [mode]);
  const selectedServices = ["Lawn Care", "House Cleaning"];
  return (
    <AppSafeAreaView>
      <ScrollView>
        <VStack space={3}>
          {isEdit && (
            <Text textAlign={"center"} fontSize={20}>
              Let's make sure {"\n"} we've got the right place
            </Text>
          )}
          {isPreview && (
            <Text textAlign={"center"} fontSize={20}>
              Order Summary
            </Text>
          )}
          <HStack
            justifyContent={"space-around"}
            alignItems={"center"}
            bg={"amber.300"}
            py={3}
          >
            <Text>
              123 Main Street {"\n"}
              Austin, TX 77777
            </Text>
            <Button
              bg="white"
              borderWidth={0}
              height={8}
              variant={"outline"}
              borderRadius={25}
              size={"xs"}
              onPress={() => navigate("Address", { mode: "UPDATE" })}
            >
              <Text color={"black"} fontSize={10}>
                CHANGE ADDRESS
              </Text>
            </Button>
          </HStack>
          <Center>
            <Text fontWeight={"semibold"} fontSize={14}>
              Please confirm the information below
            </Text>
          </Center>
          <VStack>
            <ServiceDetailsSection title="Lawn Care">
              <ChooseServiceDetailsButton
                title="Choose Lot Size, Service Type & Schedule"
                onPress={() => {
                  setShowServiceDesc(true);
                }}
              />
            </ServiceDetailsSection>
            <ServiceDetailsSection title="Pool Cleaning">
              <ChooseServiceDetailsButton
                title="Choose Lot Size, Service Type & Schedule"
                onPress={() => {}}
              />
            </ServiceDetailsSection>
            <ServiceDetailsSection title="House Cleaning">
              <ChooseServiceDetailsButton
                title="Choose Lot Size, Service Type & Schedule"
                onPress={() => {}}
              />
            </ServiceDetailsSection>
            <ServiceDetailsSection title="Pest Control">
              <ChooseServiceDetailsButton
                title="Choose Lot Size, Service Type & Schedule"
                onPress={() => {}}
              />
            </ServiceDetailsSection>
          </VStack>
          <Divider thickness={1} />
          <Center>
            <Button
              variant={"outline"}
              borderColor={AppColors.SECONDARY}
              borderRadius={20}
            >
              <Text>Add Service Note</Text>
            </Button>
          </Center>
          <Divider thickness={0} mt={200} />
        </VStack>
      </ScrollView>
      <EditServiceInfo isOpen={showServiceDesc} onClose={() => {}} />
      <OrderSummary selectedServices={selectedServices} />
      <FooterButton
        label="SAVE SERVICE DETAILS"
        subText="Provide payment information in next step"
        onPress={() => navigate("ServiceDetails", { mode: "EDIT" })}
      />
    </AppSafeAreaView>
  );
};

export default ServiceDetails;
