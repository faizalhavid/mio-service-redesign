import {
  Center,
  Divider,
  Image,
  Pressable,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
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
  selectFirstOrder,
  selectUpcomingOrders,
} from "../../slices/order-slice";
import { AddressBottomSheet } from "../../components/AddressBottomSheet";
import WarningLabel from "../../components/WarningLabel";
import UpcomingPast from "../../components/UpcomingPast";
import VirtualizedView from "../../components/VirtualizedView";
import { isAddressExists } from "../../services/address-validation";
import { getServicesAsync } from "../../slices/service-slice";
import { selectRefreshNeeded } from "../../slices/shared-slice";

const Home = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const [showEditAddress, setShowEditAddress] = useState(false);

  const {
    member: { data: upcomingOrders = [] },
    uiState: upcomingOrdersUiState,
  } = useAppSelector(selectUpcomingOrders);

  const { uiState: customerUiState } = useAppSelector(selectCustomer);

  const { addressExists, addressMode } = isAddressExists();

  const { logout, isViewer } = useAuth();
  const { setUserId } = useAnalytics();

  const [contentReady, setContentReady] = useState<boolean>(false);

  const init = React.useCallback(async () => {
    let APP_INITIAL_SETUP_COMPLETED = await StorageHelper.getValue(
      FLAG_TYPE.ALL_INITIAL_SETUP_COMPLETED
    );
    if (APP_INITIAL_SETUP_COMPLETED !== STATUS.COMPLETED) {
      logout();
      popToPop("Welcome");
      return;
    }
    StorageHelper.getValue("CUSTOMER_ID").then((cId) => {
      setUserId(cId || "");
      if (cId) {
        dispatch(getCustomerByIdAsync(cId));
      }
    });
    dispatch(getServicesAsync());
  }, []);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (customerUiState === "SUCCESS" && upcomingOrdersUiState === "SUCCESS") {
      setShowEditAddress(!addressExists);
      setContentReady(true);
    }
  }, [customerUiState, upcomingOrdersUiState, addressExists]);

  const { member: firstOrder } = useAppSelector(selectFirstOrder);

  const [readableDateTime, setReadableDateTime] = useState<any>({});

  useEffect(() => {
    if (Object.keys(firstOrder).length > 0) {
      setReadableDateTime(getReadableDateTime(firstOrder.appointmentDateTime));
    }
  }, [firstOrder]);

  return (
    <AppSafeAreaView loading={!contentReady} bg={AppColors.EEE}>
      <VirtualizedView>
        <VStack>
          {contentReady && (
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
                    <Center py={5} bg={AppColors.TEAL} borderTopRadius={5}>
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
                      showReschedule={!isViewer}
                      showChat={!isViewer}
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
              <Divider my={1} thickness={0} />
            </View>
          )}
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
      {!isViewer && <FloatingButton />}
    </AppSafeAreaView>
  );
};

export default Home;
