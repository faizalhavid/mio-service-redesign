import {
  Button,
  Center,
  Divider,
  Image,
  Pressable,
  Text,
  Toast,
  View,
  VStack,
} from "native-base";
import React, { useEffect, useMemo, useState } from "react";
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

  const { uiState: pastOrdersUiState } = useAppSelector(selectPastOrders);

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

  const isAddressAvailable = useMemo(() => {
    if (
      (customer && !customer?.addresses) ||
      customer?.addresses.length === 0 ||
      (customer?.addresses.length > 0 &&
        (!Boolean(customer?.addresses[0].street) ||
          !Boolean(customer?.addresses[0].zip)))
    ) {
      setAddressMode("UPDATE_ADDRESS");
      return false;
    }
    if (
      !customer ||
      !customer?.addresses ||
      customer?.addresses.length === 0 ||
      (customer?.addresses.length > 0 &&
        (!Boolean(customer?.addresses[0]?.houseInfo?.lotSize) ||
          !Boolean(customer?.addresses[0]?.houseInfo?.bedrooms) ||
          !Boolean(customer?.addresses[0]?.houseInfo?.bathrooms) ||
          !Boolean(customer?.addresses[0]?.houseInfo?.swimmingPoolType) ||
          !Boolean(customer?.addresses[0]?.houseInfo?.pestType)))
    ) {
      setAddressMode("UPDATE_PROPERTY");
      return false;
    }
    return true;
  }, [customer]);

  useEffect(() => {
    if (customerUiState === "SUCCESS") {
      setShowEditAddress(!isAddressAvailable);
    }
  }, [customerUiState, isAddressAvailable]);

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
          <View px={3}>
            {/* <Text
              color={AppColors.SECONDARY}
              mx={3}
              my={2}
              // textAlign="center"
              fontWeight={"bold"}
              fontSize={18}
            >
              Hi, {customer?.firstName}
            </Text> */}
            {!isAddressAvailable && (
              <WarningLabel
                text="Update Address & Property details"
                onPress={() => {
                  setShowEditAddress(true);
                }}
              />
            )}
            {isAddressAvailable && upcomingOrders.length === 0 && (
              <Pressable
                borderRadius={10}
                borderWidth={1}
                borderColor={AppColors.TEAL}
                width={"100%"}
                bg="white"
                mt={5}
                _pressed={{
                  backgroundColor: AppColors.DARK_PRIMARY,
                }}
                onPress={() => navigate("ChooseService")}
              >
                <VStack space={5} width={"100%"}>
                  <Center py={5} bg={AppColors.TEAL}>
                    <Image
                      w={20}
                      h={12}
                      alt="Logo"
                      source={require("../../assets/images/mio-logo-white.png")}
                    />
                  </Center>
                </VStack>
                <VStack py={3} space={5}>
                  <Center>
                    <Text
                      fontWeight={"semibold"}
                      fontSize={16}
                      color={AppColors.DARK_TEAL}
                    >
                      Create your first service
                    </Text>
                    <Text
                      fontSize={12}
                      fontStyle={"italic"}
                      color={AppColors.DARK_TEAL}
                    >
                      Get 20% off on your first order
                    </Text>
                  </Center>
                </VStack>
              </Pressable>
            )}
            {upcomingOrders && upcomingOrders.length > 0 && (
              <>
                <Divider mt={5} thickness={0} />
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
                    getReadableDateTime(upcomingOrders[0].appointmentDateTime)
                      .day
                  }
                  slot={
                    getReadableDateTime(upcomingOrders[0].appointmentDateTime)
                      .slot
                  }
                />
              </>
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
      <FloatingButton />
    </AppSafeAreaView>
  );
};

export default Home;
