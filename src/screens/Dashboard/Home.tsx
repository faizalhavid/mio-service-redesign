import {
  Button,
  Center,
  Divider,
  HStack,
  Image,
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
import { getAllOrders, getAppointments } from "../../services/order";
import { SERVICES } from "../Home/ChooseService";
import { getReadableDateTime } from "../../services/utils";
import { SvgCss } from "react-native-svg";
import { PLUS_ICON } from "../../commons/assets";

export type Order = {
  orderId: string;
  subOrderId: string;
  appointmentDateTime: string;
  serviceId: string;
};
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

  const [upcomingOrders, setUpcomingOrders] = React.useState<Order[]>([]);
  const getAllUpcomingOrdersQuery = useQuery(
    "getAllUpcomingOrders",
    () => {
      setLoading(true);
      return getAllOrders("upcoming");
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setUpcomingOrders(data.data);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const [pastOrders, setPastOrders] = React.useState<Order[]>([]);
  const getAllPastOrdersQuery = useQuery(
    "getAllPastOrders",
    () => {
      setLoading(true);
      return getAllOrders("past");
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setPastOrders(data.data);
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
              <Center>
                <Text fontWeight={"semibold"} fontSize={16}>
                  Welcome {customerProfile?.firstName}
                </Text>
                <Text mt={2} textAlign={"center"}>
                  Get ready for a beautiful service! {"\n"} Your next service is
                  scheduled for
                </Text>
              </Center>
              {upcomingOrders.length > 0 ? (
                <ServiceCard
                  variant="solid"
                  showAddToCalendar={false}
                  showReschedule={false}
                  showChat={false}
                  serviceName={SERVICES[upcomingOrders[0].serviceId].text}
                  orderId={upcomingOrders[0].orderId}
                  subOrderId={upcomingOrders[0].subOrderId}
                  year={
                    getReadableDateTime(upcomingOrders[0].appointmentDateTime)
                      .year
                  }
                  date={
                    getReadableDateTime(upcomingOrders[0].appointmentDateTime)
                      .date
                  }
                  day={
                    getReadableDateTime(upcomingOrders[0].appointmentDateTime)
                      .day
                  }
                  slot={
                    getReadableDateTime(upcomingOrders[0].appointmentDateTime)
                      .slot
                  }
                />
              ) : (
                <Button
                  paddingX={5}
                  mt={5}
                  borderRadius={10}
                  borderWidth={1}
                  borderColor={AppColors.SECONDARY}
                  bg={AppColors.SECONDARY}
                  shadow={3}
                  width={"100%"}
                  _pressed={{
                    backgroundColor: AppColors.DARK_PRIMARY,
                  }}
                  variant={"ghost"}
                  onPress={() => navigate("ChooseService")}
                >
                  <VStack p={5} space={5}>
                    <Center>
                      <Image
                        w={20}
                        h={12}
                        alt="Logo"
                        source={require("../../assets/images/mio-logo-white.png")}
                      />
                    </Center>
                    <Center>
                      <Text fontSize={16} color={"#fff"}>
                        Create your first service
                      </Text>
                      <Text fontSize={12} fontStyle={"italic"} color={"#fff"}>
                        Get 25% off on your first order
                      </Text>
                    </Center>
                  </VStack>
                </Button>
              )}
              <Divider my={5} thickness={1} />
              <Text fontSize={18} pl={2} fontWeight={"semibold"}>
                Upcoming Services
              </Text>
              <ScrollView width={400} horizontal={true}>
                <HStack mr={20} space={3}>
                  {upcomingOrders.length === 0 && (
                    <>
                      <Text mt={2} pl={2} fontStyle={"italic"}>
                        No upcoming services are there!
                      </Text>
                    </>
                  )}
                  {upcomingOrders.map((order: Order, index: number) => {
                    return (
                      <ServiceCard
                        key={index}
                        variant="outline"
                        showAddToCalendar={false}
                        serviceName={SERVICES[order.serviceId].text}
                        orderId={order.orderId}
                        subOrderId={order.subOrderId}
                        year={
                          getReadableDateTime(order.appointmentDateTime).year
                        }
                        date={
                          getReadableDateTime(order.appointmentDateTime).date
                        }
                        day={getReadableDateTime(order.appointmentDateTime).day}
                        slot={
                          getReadableDateTime(order.appointmentDateTime).slot
                        }
                      />
                    );
                  })}
                </HStack>
              </ScrollView>
              <Divider my={5} thickness={1} />
              <Text fontSize={18} pl={2} fontWeight={"semibold"}>
                Past Services
              </Text>
              <ScrollView width={400} horizontal={true}>
                <HStack mr={20} space={3}>
                  {pastOrders.length === 0 && (
                    <>
                      <Text mt={2} pl={2} fontStyle={"italic"}>
                        No past services are there!
                      </Text>
                    </>
                  )}
                  {pastOrders.map((order: any, index: number) => {
                    return (
                      <ServiceCard
                        key={index}
                        variant="outline"
                        showAddToCalendar={false}
                        serviceName={SERVICES[order.serviceId].text}
                        orderId={order.orderId}
                        subOrderId={order.subOrderId}
                        year={
                          getReadableDateTime(order.appointmentDateTime).year
                        }
                        date={
                          getReadableDateTime(order.appointmentDateTime).date
                        }
                        day={getReadableDateTime(order.appointmentDateTime).day}
                        slot={
                          getReadableDateTime(order.appointmentDateTime).slot
                        }
                      />
                    );
                  })}
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
