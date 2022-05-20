import {
  Box,
  Button,
  Center,
  Circle,
  Divider,
  HStack,
  Image,
  Pressable,
  Skeleton,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useState } from "react";
import { ImageBackground, Linking } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import ServiceCard from "../../components/ServiceCard";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import { useAuth } from "../../contexts/AuthContext";
import { AppColors } from "../../commons/colors";
import { useIsFocused } from "@react-navigation/native";
import { SERVICES } from "../Home/ChooseService";
import { getReadableDateTime } from "../../services/utils";
import { FLAG_TYPE, STATUS } from "../../commons/status";
import { StorageHelper } from "../../services/storage-helper";
import { useAnalytics } from "../../services/analytics";
import { SvgCss } from "react-native-svg";
import { CALENDAR_ICON, STAR_ICON, USER_ICON } from "../../commons/assets";
import { useAppDispatch } from "../../hooks/useAppDispatch";

import { useAppSelector } from "../../hooks/useAppSelector";
import {
  getCustomerByIdAsync,
  selectCustomer,
} from "../../slices/customer-slice";
import {
  selectPastOrders,
  selectUpcomingOrders,
} from "../../slices/order-slice";
import { IN_PROGRESS } from "../../commons/ui-states";
import {
  AddressBottomSheet,
  AddressMode,
} from "../../components/AddressBottomSheet";
import WarningLabel from "../../components/WarningLabel";
import UpcomingPast from "../../components/UpcomingPast";
import VirtualizedView from "../../components/VirtualizedView";

const Home = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const isFocused = useIsFocused();

  const [showEditAddress, setShowEditAddress] = useState(false);
  const [addressMode, setAddressMode] = useState<AddressMode>("UPDATE_ADDRESS");

  const {
    uiState: upcomingOrdersUiState,
    member: { data: upcomingOrders = [] },
  } = useAppSelector(selectUpcomingOrders);

  const {
    uiState: pastOrdersUiState,
    member: { data: pastOrders = [] },
  } = useAppSelector(selectPastOrders);

  const { uiState: customerUiState, member: customer } =
    useAppSelector(selectCustomer);

  const { logout } = useAuth();
  const { setUserId } = useAnalytics();

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
    setUserId(cId || "");
    dispatch(getCustomerByIdAsync(cId));
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
    <AppSafeAreaView
      mt={0}
      loading={
        customerUiState === IN_PROGRESS ||
        upcomingOrdersUiState === IN_PROGRESS ||
        pastOrdersUiState === IN_PROGRESS
      }
      bg={AppColors.EEE}
    >
      <VirtualizedView>
        <VStack>
          {customer?.addresses &&
            (customer?.addresses.length === 0 ||
              (customer?.addresses.length > 0 &&
                !Boolean(customer?.addresses[0].street))) && (
              <WarningLabel
                text="Update address & property details"
                onPress={() => {
                  setShowEditAddress(true);
                }}
              />
            )}
          <View px={3}>
            <Text mx={3} my={2} fontWeight={"bold"} fontSize={18}>
              Hi, {customer?.firstName}
            </Text>
            {upcomingOrders && upcomingOrders.length > 0 && (
              <ServiceCard
                variant="solid"
                dateTime={upcomingOrders[0].appointmentDateTime}
                showWelcomeMessage={true}
                showAddToCalendar={true}
                showReschedule={true}
                showChat={true}
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
                month={
                  getReadableDateTime(upcomingOrders[0].appointmentDateTime)
                    .month
                }
                day={
                  getReadableDateTime(upcomingOrders[0].appointmentDateTime).day
                }
                slot={
                  getReadableDateTime(upcomingOrders[0].appointmentDateTime)
                    .slot
                }
              />
            )}
          </View>
          <Divider my={2} thickness={1} />
          <UpcomingPast />
        </VStack>
      </VirtualizedView>
      {showEditAddress && (
        <AddressBottomSheet
          mode={addressMode}
          showEditAddress={showEditAddress}
          setShowEditAddress={setShowEditAddress}
        />
      )}
      <FloatingButton
        onPress={() => {
          if (!customer?.addresses[0]?.zip) {
            setAddressMode("UPDATE_ADDRESS");
            setShowEditAddress(true);
          } else if (!customer?.addresses[0]?.houseInfo?.bedrooms) {
            setAddressMode("UPDATE_PROPERTY");
            setShowEditAddress(true);
          } else {
            navigate("ChooseService");
          }
        }}
      />
    </AppSafeAreaView>
  );
};

export default Home;
