import {
  Center,
  Divider,
  Image,
  Pressable,
  Text,
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
import { AddressBottomSheet } from "../../components/AddressBottomSheet";
import WarningLabel from "../../components/WarningLabel";
import UpcomingPast from "../../components/UpcomingPast";
import VirtualizedView from "../../components/VirtualizedView";
import { Order } from "../../commons/types";
import { isAddressExists } from "../../services/address-validation";

const Home = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const isFocused = useIsFocused();

  const [showEditAddress, setShowEditAddress] = useState(false);

  const {
    member: { data: upcomingOrders = [] },
  } = useAppSelector(selectUpcomingOrders);

  const { uiState: pastOrdersUiState } = useAppSelector(selectPastOrders);

  const { uiState: customerUiState } = useAppSelector(selectCustomer);

  const { addressExists, addressMode } = isAddressExists();

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
  }, []);

  useEffect(() => {
    StorageHelper.getValue("CUSTOMER_ID").then((cId) => {
      setUserId(cId || "");
      dispatch(getCustomerByIdAsync(cId));
    });
  }, []);

  React.useEffect(() => {
    if (isFocused) {
      init();
    }
  }, [init, isFocused]);

  useEffect(() => {
    if (customerUiState === "SUCCESS") {
      setShowEditAddress(!addressExists);
    }
  }, [customerUiState, addressExists]);

  const [firstOrder, setFirstOrder] = useState<Order>({} as Order);

  const readableDateTime: any = useMemo(() => {
    if (Object.keys(firstOrder).length > 0) {
      return getReadableDateTime(firstOrder.appointmentDateTime);
    }
    return {};
  }, [firstOrder]);

  useEffect(() => {
    if (upcomingOrders.length > 0 && Object.keys(firstOrder).length === 0) {
      setFirstOrder(upcomingOrders[0]);
    }
  }, [upcomingOrders]);

  return (
    <AppSafeAreaView
      loading={customerUiState === IN_PROGRESS}
      bg={AppColors.EEE}
    >
      <VirtualizedView>
        <VStack>
          <View px={3}>
            {!addressExists && (
              <WarningLabel
                text="Update Address & Property details"
                onPress={() => {
                  setShowEditAddress(true);
                }}
              />
            )}
            {addressExists && upcomingOrders.length === 0 && (
              <Pressable
                borderRadius={10}
                borderWidth={1}
                borderColor={AppColors.TEAL}
                width={"100%"}
                bg="white"
                mt={5}
                _pressed={{
                  backgroundColor: "white",
                }}
                onPress={() => {
                  StorageHelper.setValue("COUPON_SELECTED", "NC20P");
                  navigate("ChooseService");
                }}
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
                      Get 20% off on your first order with NC20P
                    </Text>
                  </Center>
                </VStack>
              </Pressable>
            )}
            {upcomingOrders &&
              upcomingOrders.length > 0 &&
              Object.keys(firstOrder).length > 0 && (
                <>
                  <Divider mt={5} thickness={0} />
                  <ServiceCard
                    variant="solid"
                    dateTime={firstOrder?.appointmentDateTime}
                    showWelcomeMessage={true}
                    showAddToCalendar={true}
                    showReschedule={true}
                    showChat={true}
                    serviceName={SERVICES[firstOrder?.serviceId].text}
                    orderId={firstOrder?.orderId}
                    subOrderId={firstOrder?.subOrderId}
                    year={readableDateTime?.year}
                    date={readableDateTime?.date}
                    month={readableDateTime?.month}
                    day={readableDateTime?.day}
                    slot={readableDateTime?.slot}
                  />
                </>
              )}
          </View>
          <Divider my={1} thickness={0} />
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
