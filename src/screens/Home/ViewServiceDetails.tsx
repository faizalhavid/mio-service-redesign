import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Center,
  Divider,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { SvgCss } from "react-native-svg";
import { useMutation } from "react-query";
import {
  INFO_ICON,
  CIRCLE_TICK_ICON,
  CALENDAR_ICON,
  CHAT_ICON,
  CHAT_OUTLINE_ICON,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import { SubOrder } from "../../commons/types";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import { CustomerProfile, useAuth } from "../../contexts/AuthContext";
import { SuperRootStackParamList } from "../../navigations";
import { getCustomer } from "../../services/customer";
import { getOrderDetails } from "../../services/order";
import { getReadableDateTime } from "../../services/utils";
import { SERVICES } from "./ChooseService";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ViewServiceDetailsProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "ViewServiceDetails"
>;
const ViewServiceDetails = ({
  route,
}: ViewServiceDetailsProps): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const { orderId, subOrderId } = route.params;
  const [customerId, setCustomerId] = React.useState<string | null>(null);

  const { customerProfile, setCustomerProfile } = useAuth();

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

  const fetchCustomerProfile = React.useCallback(async () => {
    let cId = await AsyncStorage.getItem("CUSTOMER_ID");
    setCustomerId(cId);
    await getCustomerMutation.mutateAsync();
  }, []);

  React.useEffect(() => {
    fetchCustomerProfile();
  }, [fetchCustomerProfile]);

  const [orderDetail, setOrderDetail] = React.useState<SubOrder>(
    {} as SubOrder
  );
  const getOrderDetailMutation = useMutation(
    "getOrderDetailOrders",
    () => {
      setLoading(true);
      return getOrderDetails(orderId, subOrderId);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        setOrderDetail(data.data);
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );

  useEffect(() => {
    if (orderId && subOrderId) {
      getOrderDetailMutation.mutate();
    } else {
      return;
    }
  }, [orderId, subOrderId]);

  return (
    <AppSafeAreaView loading={loading}>
      <ScrollView>
        {orderDetail?.appointmentInfo?.appointmentDateTime && (
          <VStack>
            <Center mb={2}>
              <Text fontSize={20}>Service Details</Text>
            </Center>
            <Divider thickness={0} mt={5} />
            <Center bg={AppColors.PRIMARY} shadow={2} px={6} py={2}>
              <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
                Overview
              </Text>
            </Center>
            <VStack
              my={2}
              mx={2}
              py={2}
              space={2}
              borderWidth={1}
              borderRadius={10}
              borderColor={AppColors.PRIMARY}
            >
              <Center>
                <Text
                  color={AppColors.SECONDARY}
                  fontSize={16}
                  fontWeight={"semibold"}
                >
                  {SERVICES[orderDetail.serviceId].text}
                </Text>
                <Text color={AppColors.SECONDARY} fontSize={14}>
                  {
                    getReadableDateTime(
                      orderDetail?.appointmentInfo?.appointmentDateTime
                    ).all
                  }
                </Text>
                <Divider thickness={0} mt={5} />
                {customerProfile?.addresses &&
                  customerProfile?.addresses.length > 0 && (
                    <>
                      <Text
                        color={AppColors.SECONDARY}
                        fontSize={16}
                        fontWeight={"semibold"}
                      >
                        {customerProfile?.addresses[0]?.street}
                      </Text>
                      <Text color={AppColors.SECONDARY} fontSize={14}>
                        {customerProfile?.addresses[0]?.city},{" "}
                        {customerProfile?.addresses[0]?.state}{" "}
                        {customerProfile?.addresses[0]?.zip}
                      </Text>
                    </>
                  )}
              </Center>
            </VStack>
            <Center bg={AppColors.PRIMARY} shadow={2} px={6} py={2}>
              <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
                Service Provider
              </Text>
            </Center>
            <VStack
              my={2}
              mx={2}
              py={2}
              space={2}
              borderWidth={1}
              borderRadius={10}
              borderColor={AppColors.PRIMARY}
            >
              <Center>
                <Text
                  fontSize={16}
                  color={AppColors.SECONDARY}
                  fontWeight={"semibold"}
                >
                  Mio Home Services
                </Text>
                {/* <Text fontSize={14}>Jay's Green Lawns</Text>
              <Divider thickness={0} mt={5} />
              <Text fontSize={14}>12115 West Airport Blvd,</Text>
              <Text fontSize={14}>Sugar Land, Texas 77404</Text>
              <Text fontSize={14}>000-000-0000</Text>
              <Text fontSize={14}>name@email.com</Text> */}
              </Center>
            </VStack>
            <Center bg={AppColors.PRIMARY} shadow={2} px={6} py={2}>
              <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
                Service Details
              </Text>
            </Center>
            <VStack
              my={2}
              mx={2}
              space={2}
              borderWidth={1}
              py={3}
              borderRadius={10}
              borderColor={AppColors.PRIMARY}
            >
              {orderDetail.serviceId === "lawnCare" && (
                <HStack space={2} alignItems={"center"} pl={3}>
                  <SvgCss xml={INFO_ICON} width={20} height={20} />
                  <Text color={AppColors.SECONDARY} fontSize={14}>
                    {orderDetail.area + " Sq. Ft."}
                  </Text>
                </HStack>
              )}
              {orderDetail.serviceId === "houseCleaning" && (
                <HStack space={2} alignItems={"center"} pl={3}>
                  <SvgCss xml={INFO_ICON} width={20} height={20} />
                  <Text color={AppColors.SECONDARY} fontSize={14}>
                    Bedroom - {orderDetail.bedrooms} | Bathrooms -{" "}
                    {orderDetail.bathrooms}
                  </Text>
                </HStack>
              )}
              <HStack space={2} alignItems={"center"} pl={3}>
                <SvgCss xml={CIRCLE_TICK_ICON} width={20} height={20} />
                <Text color={AppColors.SECONDARY} fontSize={14}>
                  ${orderDetail?.servicePrice.cost}{" "}
                  <Text textTransform={"capitalize"}>
                    {orderDetail?.flags?.recurringDuration}
                    {orderDetail?.flags?.isRecurring ? " - Recurring" : ""}
                  </Text>
                </Text>
              </HStack>
              <HStack space={2} alignItems={"center"} pl={3}>
                <SvgCss xml={CALENDAR_ICON} width={20} height={20} />
                <Text color={AppColors.SECONDARY} fontSize={14}>
                  {
                    getReadableDateTime(
                      orderDetail?.appointmentInfo?.appointmentDateTime
                    ).all
                  }
                </Text>
              </HStack>
              <HStack space={2} alignItems={"center"} pl={3}>
                <SvgCss
                  xml={CHAT_OUTLINE_ICON(AppColors.SECONDARY)}
                  width={20}
                  height={20}
                />
                <Text color={AppColors.SECONDARY} fontSize={14}>
                  {orderDetail?.serviceNotes[0]}
                </Text>
              </HStack>
            </VStack>
            <Divider thickness={0} mt={150} />
          </VStack>
        )}
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default ViewServiceDetails;
