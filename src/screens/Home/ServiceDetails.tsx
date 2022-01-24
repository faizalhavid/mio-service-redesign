import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Button,
  Center,
  Divider,
  HStack,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import {
  CALENDAR_ICON,
  CIRCLE_TICK_ICON,
  INFO_ICON,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ChooseServiceDetailsButton from "../../components/ChooseServiceDetailsButton";
import FooterButton from "../../components/FooterButton";
import OrderSummary from "../../components/OrderSummary";
import ServiceDetailsSection from "../../components/ServiceDetailsSection";
import { SuperRootStackParamList } from "../../navigations";
import { navigate } from "../../navigations/rootNavigation";
import PriceBreakdown from "./PriceBreakdown";

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
        <VStack space={5}>
          <Text textAlign={"center"} fontSize={18}>
            Let's make sure {"\n"} we've got the right place
          </Text>
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
          <VStack space={1}>
            <ServiceDetailsSection title="Lawn Care" noData={true}>
              <ChooseServiceDetailsButton
                title="Choose Lot Size, Service Type & Schedule"
                onPress={() => {
                  navigate("EditServiceDetails");
                }}
              />
            </ServiceDetailsSection>
            <ServiceDetailsSection title="Pool Cleaning" noData={false}>
              {/* <ChooseServiceDetailsButton
                title="Choose Lot Size, Service Type & Schedule"
                onPress={() => {}}
              /> */}
              <HStack space={2} alignItems={"center"} pl={3}>
                <SvgCss xml={INFO_ICON} width={20} height={20} />
                <Text color={AppColors.SECONDARY} fontSize={14}>
                  Lot Size
                </Text>
              </HStack>
              <HStack space={2} alignItems={"center"} pl={3}>
                <SvgCss xml={CIRCLE_TICK_ICON} width={20} height={20} />
                <Text color={AppColors.SECONDARY} fontSize={14}>
                  $40 weekly service
                </Text>
              </HStack>
              <HStack space={2} alignItems={"center"} pl={3}>
                <SvgCss xml={CALENDAR_ICON} width={20} height={20} />
                <Text color={AppColors.SECONDARY} fontSize={14}>
                  Monday, Aug 2, 8:00 AM - 10 AM
                </Text>
              </HStack>
            </ServiceDetailsSection>
            <ServiceDetailsSection title="House Cleaning" noData={true}>
              <ChooseServiceDetailsButton
                title="Choose Lot Size, Service Type & Schedule"
                onPress={() => {}}
              />
            </ServiceDetailsSection>
            <ServiceDetailsSection title="Pest Control" noData={true}>
              <ChooseServiceDetailsButton
                title="Choose Lot Size, Service Type & Schedule"
                onPress={() => {}}
              />
            </ServiceDetailsSection>
          </VStack>
          {/* <Divider thickness={10} /> */}
          {/* <PriceBreakdown /> */}
          <Divider thickness={0} mt={0} mb={200} />
        </VStack>
      </ScrollView>
      {/* <OrderSummary selectedServices={selectedServices} /> */}
      <FooterButton
        v2={false}
        label="CHOOSE PAYMENT METHOD"
        subText="Provide payment information in next step"
        onPress={() => navigate("Payment")}
      />
    </AppSafeAreaView>
  );
};

export default ServiceDetails;
