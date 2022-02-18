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
import { ImageBackground } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import ServiceCard from "../../components/ServiceCard";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomerProfile, useAuth } from "../../contexts/AuthContext";
import { useMutation, useQuery } from "react-query";
import { getCustomer } from "../../services/customer";
import { AppColors } from "../../commons/colors";
import { useIsFocused } from "@react-navigation/native";
import { getAppointments } from "../../services/order";

export interface Appointment {
  customerId: string;
  providerId: string;
  serviceId: string;
  eaApptId: number;
  book: string;
  start: string;
  end: string;
  temperature: number;
  forecast: string;
  hash: string;
  notes?: any;
  eaCustomerId: number;
  eaProviderId: number;
  eaServiceId: number;
  googleCalendarId?: any;
}

const Home = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [customerId, setCustomerId] = React.useState<string | null>(null);

  const [customerProfile, setCustomerProfile] = React.useState<CustomerProfile>(
    {} as CustomerProfile
  );

  const isFocused = useIsFocused();

  const { reload } = useAuth();

  const getCustomerMutation = useMutation(
    "getCustomer",
    () => {
      setLoading(true);
      return getCustomer(customerId);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setCustomerProfile(data.data);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const getAppointmentsQuery = useQuery(
    "getAppointments",
    () => {
      setLoading(true);
      return getAppointments();
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setCustomerProfile(data.data);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const fetchCustomerProfile = React.useCallback(async () => {
    let APP_STATUS = await AsyncStorage.getItem("APP_START_STATUS");
    if (APP_STATUS !== "SETUP_COMPLETED") {
      console.log("Current APP_STATUS", APP_STATUS);
      AsyncStorage.clear();
      popToPop("Welcome");
      return;
    }
    let cId = await AsyncStorage.getItem("CUSTOMER_ID");
    setCustomerId(cId);
    await getCustomerMutation.mutateAsync();
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      fetchCustomerProfile();
    }
  }, [fetchCustomerProfile, isFocused]);

  return (
    <AppSafeAreaView mt={0} loading={loading}>
      <ScrollView>
        <VStack pb={150}>
          <ImageBackground
            resizeMode="cover"
            style={{
              padding: 10,
            }}
            source={require("../../assets/images/dashboard-bg.png")}
          >
            <VStack pt={10}>
              {/* {false &&
                customerProfile?.addresses &&
                (customerProfile?.addresses.length === 0 ||
                  (customerProfile?.addresses.length > 0 &&
                    !Boolean(customerProfile?.addresses[0].street))) && (
                  <HStack
                    mb={5}
                    borderWidth={1}
                    borderRadius={7}
                    bg={"#ccfbf133"}
                    p={2}
                    justifyContent="space-between"
                    alignItems={"center"}
                  >
                    <Text
                      color={AppColors.SECONDARY}
                      fontSize={14}
                      fontWeight={"semibold"}
                    >
                      Please update address before {"\n"}creating a order
                    </Text>
                    <Button
                      bg={AppColors.SECONDARY}
                      onPress={() => {
                        navigate("Address", { returnTo: "Dashboard" });
                      }}
                    >
                      Update
                    </Button>
                  </HStack>
                )} */}
              <Center>
                <Text fontWeight={"semibold"} fontSize={16}>
                  Welcome Back {customerProfile?.firstName}
                </Text>
                <Text mt={2} textAlign={"center"}>
                  Get ready for a beautiful lawn! {"\n"} Your next service is
                  scheduled for
                </Text>
              </Center>
              <ServiceCard
                variant="solid"
                showAddToCalendar={false}
                showReschedule={false}
                showChat={false}
              />
              <Divider my={5} thickness={1} />
              <Text fontSize={18} pl={2} fontWeight={"semibold"}>
                Upcoming Services
              </Text>
              <ScrollView width={400} horizontal={true}>
                <HStack mr={20} space={3}>
                  <ServiceCard variant="outline" showAddToCalendar={false} />
                  <ServiceCard variant="outline" showAddToCalendar={false} />
                  <ServiceCard variant="outline" showAddToCalendar={false} />
                </HStack>
              </ScrollView>
              <Divider my={5} thickness={1} />
              <Text fontSize={18} pl={2} fontWeight={"semibold"}>
                Past Services
              </Text>
              <ScrollView width={400} horizontal={true}>
                <HStack mr={20} space={3}>
                  <ServiceCard variant="outline" />
                  <ServiceCard variant="outline" />
                  <ServiceCard variant="outline" />
                </HStack>
              </ScrollView>
            </VStack>
          </ImageBackground>
        </VStack>
      </ScrollView>
      <FloatingButton onPress={() => navigate("ChooseService")} />
    </AppSafeAreaView>
  );
};

export default Home;
