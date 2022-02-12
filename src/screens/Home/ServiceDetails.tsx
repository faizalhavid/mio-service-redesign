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
import { CustomerProfile, useAuth } from "../../contexts/AuthContext";
import { useLeads } from "../../hooks/useLeads";
import { SuperRootStackParamList } from "../../navigations";
import { navigate } from "../../navigations/rootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "react-query";
import { getCustomer } from "../../services/customer";
import { SERVICES } from "./ChooseService";

type ServiceDetailsProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "ServiceDetails"
>;
const ServiceDetails = ({ route }: ServiceDetailsProps): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const { mode } = route.params;
  const [isPreview, setIsPreview] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [showServiceDesc, setShowServiceDesc] = React.useState(false);
  const [customerId, setCustomerId] = React.useState<string | null>(null);
  const { leadDetails } = useAuth();

  const [customerProfile, setCustomerProfile] = React.useState<CustomerProfile>(
    {} as CustomerProfile
  );

  const getCustomerMutation = useMutation(
    "getCustomer",
    () => {
      setLoading(true);
      return getCustomer(customerId);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        console.log(data);
        setCustomerProfile(data.data);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const fetchCustomerProfile = React.useCallback(async () => {
    let cId = await AsyncStorage.getItem("customerId");
    setCustomerId(cId);
    await getCustomerMutation.mutateAsync();
  }, []);

  React.useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

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
            {customerProfile?.addresses &&
              customerProfile?.addresses.length > 0 && (
                <Text>
                  {customerProfile?.addresses[0]?.street} {"\n"}
                  {customerProfile?.addresses[0]?.city},{" "}
                  {customerProfile?.addresses[0]?.state}{" "}
                  {customerProfile?.addresses[0]?.zip}
                </Text>
              )}
            <Button
              bg="white"
              borderWidth={0}
              height={8}
              variant={"outline"}
              borderRadius={25}
              size={"xs"}
              onPress={() => navigate("Address", { mode: "ServiceDetails" })}
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
            {leadDetails?.subOrders?.map((lead, index) => {
              return (
                <ServiceDetailsSection
                  key={index}
                  title={SERVICES[lead.serviceId].text}
                  noData={true}
                >
                  <ChooseServiceDetailsButton
                    title="Choose Service Details & Schedule"
                    onPress={() => {
                      navigate("EditServiceDetails", {
                        serviceId: lead.serviceId,
                      });
                    }}
                  />
                </ServiceDetailsSection>
              );
            })}

            {/*  <ServiceDetailsSection title="Pool Cleaning" noData={false}>
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
            </ServiceDetailsSection> */}
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
