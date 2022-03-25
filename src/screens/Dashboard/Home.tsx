import {
  Box,
  Button,
  Center,
  Circle,
  Divider,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Skeleton,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { ImageBackground, Linking } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import ServiceCard from "../../components/ServiceCard";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import { useAuth } from "../../contexts/AuthContext";
import { useMutation } from "react-query";
import { getCustomer } from "../../services/customer";
import { AppColors } from "../../commons/colors";
import { useIsFocused } from "@react-navigation/native";
import { getAllOrders } from "../../services/order";
import { SERVICES } from "../Home/ChooseService";
import { getReadableDateTime } from "../../services/utils";
import { FLAG_TYPE, STATUS } from "../../commons/status";
import { StorageHelper } from "../../services/storage-helper";
import { useAnalytics } from "../../services/analytics";
import Svg, { SvgCss } from "react-native-svg";
import { CALENDAR_ICON, STAR_ICON, USER_ICON } from "../../commons/assets";

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

  const isFocused = useIsFocused();

  const [showFirstTimeBanner, setShowFirstTimeBanner] =
    React.useState<boolean>(false);

  const { customerProfile, setCustomerProfile, logout } = useAuth();
  const { setUserId } = useAnalytics();

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
  const getAllUpcomingOrdersMutation = useMutation(
    "getAllUpcomingOrders",
    () => {
      setLoading(true);
      return getAllOrders("upcoming");
    },
    {
      onSuccess: (data) => {
        let orders = data.data.data;
        setShowFirstTimeBanner(orders.length === 0);
        setUpcomingOrders(orders);
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const [pastOrders, setPastOrders] = React.useState<Order[]>([]);
  const getAllPastOrdersMutation = useMutation(
    "getAllPastOrders",
    () => {
      setLoading(true);
      return getAllOrders("past");
    },
    {
      onSuccess: (data) => {
        setPastOrders(data.data.data);
        setLoading(false);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  const init = React.useCallback(async () => {
    let APP_INITIAL_SETUP_COMPLETED = await StorageHelper.getValue(
      FLAG_TYPE.ALL_INITIAL_SETUP_COMPLETED
    );
    if (APP_INITIAL_SETUP_COMPLETED !== STATUS.COMPLETED) {
      logout();
      popToPop("Welcome");
      return;
    }
    let cId = await StorageHelper.getValue("CUSTOMER_ID");
    setCustomerId(cId);
    setUserId(cId || "");
    await getCustomerMutation.mutateAsync();
    getAllUpcomingOrdersMutation.mutate();
    getAllPastOrdersMutation.mutate();
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      init();
    }
  }, [init, isFocused]);

  const ViewMore = (navigateTo: string) => {
    return (
      <Pressable
        justifyContent="center"
        alignItems={"center"}
        onPress={() => navigate(navigateTo)}
      >
        <View
          paddingY={4}
          paddingX={5}
          mt={5}
          height={130}
          borderRadius={10}
          borderWidth={1}
          borderColor={AppColors.DARK_TEAL}
          width={300}
          justifyContent="center"
          alignItems={"center"}
        >
          <Center>
            <Text
              color={AppColors.DARK_TEAL}
              fontSize={"16"}
              fontWeight={"semibold"}
            >
              View More
            </Text>
          </Center>
        </View>
      </Pressable>
    );
  };

  const SERVICE_TITLE = (title: string) => {
    return (
      <HStack space={0} ml={2} alignItems={"center"}>
        <Box bg={AppColors.TEAL} p={2} borderRadius={5}>
          <SvgCss xml={CALENDAR_ICON("#fff")} />
        </Box>
        <Text fontSize={18} pl={2}>
          {title}
        </Text>
      </HStack>
    );
  };

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
                <Text fontWeight={"bold"} fontSize={18}>
                  Welcome back {customerProfile?.firstName}
                </Text>
              </Center>
              {!loading ? (
                upcomingOrders.length > 0 ? (
                  <>
                    <ServiceCard
                      variant="solid"
                      dateTime={upcomingOrders[0].appointmentDateTime}
                      showWelcomeMessage={true}
                      showAddToCalendar={true}
                      showReschedule={true}
                      showChat={false}
                      serviceName={SERVICES[upcomingOrders[0].serviceId].text}
                      orderId={upcomingOrders[0].orderId}
                      subOrderId={upcomingOrders[0].subOrderId}
                      year={
                        getReadableDateTime(
                          upcomingOrders[0].appointmentDateTime
                        ).year
                      }
                      date={
                        getReadableDateTime(
                          upcomingOrders[0].appointmentDateTime
                        ).date
                      }
                      day={
                        getReadableDateTime(
                          upcomingOrders[0].appointmentDateTime
                        ).day
                      }
                      slot={
                        getReadableDateTime(
                          upcomingOrders[0].appointmentDateTime
                        ).slot
                      }
                    />
                    <Divider my={2} thickness={0} />
                    {SERVICE_TITLE("Service Details")}
                    <HStack space={5} px={7} py={5}>
                      <Circle
                        size={75}
                        borderWidth={2}
                        borderColor={AppColors.TEAL}
                        alignSelf="center"
                        bg={AppColors.SECONDARY}
                        children={
                          <SvgCss
                            width={50}
                            height={50}
                            xml={USER_ICON("#eee")}
                          />
                        }
                      ></Circle>
                      <VStack>
                        <Text fontSize={16} justifyContent={"center"}>
                          Mio Home Services
                        </Text>
                        <HStack>
                          {Array.from(Array(5).keys()).map((v, i) => (
                            <Text key={i}>{<SvgCss xml={STAR_ICON()} />}</Text>
                          ))}
                        </HStack>
                        {/* <Text fontSize={16} mt={2}>
                          Available
                        </Text>
                        <Text fontSize={16}>Monday - Friday</Text> */}
                      </VStack>
                    </HStack>
                    <Divider
                      width="80%"
                      alignSelf={"center"}
                      bg={AppColors.TEAL}
                      thickness={0.5}
                    />
                    <Button
                      variant={"solid"}
                      width={"50%"}
                      mt={5}
                      alignSelf="center"
                      borderRadius={20}
                      bgColor={AppColors.TEAL}
                      onPress={() => {
                        Linking.openURL(
                          `mailto:support@miohomeservices.com?subject=[${
                            upcomingOrders[0]?.orderId
                          }] Service Notes&body=Hi, \n\n Order ID: ${
                            upcomingOrders[0]?.orderId
                          } \n Service Name: ${
                            SERVICES[upcomingOrders[0].serviceId].text
                          } \n\n Service Note: \n`
                        );
                      }}
                    >
                      Add Service Note
                    </Button>
                  </>
                ) : (
                  showFirstTimeBanner && (
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
                          <Text
                            fontSize={12}
                            fontStyle={"italic"}
                            color={"#fff"}
                          >
                            Get 20% off on your first order
                          </Text>
                        </Center>
                      </VStack>
                    </Button>
                  )
                )
              ) : (
                <Skeleton mt={5} width={"100%"} h="100" borderRadius={10} />
              )}
              <Divider my={5} thickness={1} />
              {SERVICE_TITLE("Upcoming Services")}
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
                        dateTime={order.appointmentDateTime}
                        variant="outline"
                        showAddToCalendar={true}
                        showReschedule={true}
                        showChat={true}
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
                  {upcomingOrders.length > 0 && ViewMore("UpcomingServices")}
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
                        dateTime={order.appointmentDateTime}
                        variant="outline"
                        showAddToCalendar={false}
                        showReschedule={false}
                        showChat={false}
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
                  {pastOrders.length > 0 && ViewMore("ServiceHistory")}
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
