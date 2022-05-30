import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Divider,
  HStack,
  Image,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import { SuperRootStackParamList } from "../../navigations";
import { getReadableDateTime } from "../../services/utils";
import {
  HOUSE_CLEANING_ID,
  LAWN_CARE_ID,
  PEST_CONTROL_ID,
  POOL_CLEANING_ID,
  SERVICES,
} from "./ChooseService";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCustomer } from "../../slices/customer-slice";
import {
  getOrderDetailsAsync,
  selectOrderDetails,
} from "../../slices/order-slice";
import { IN_PROGRESS } from "../../commons/ui-states";

type ViewServiceDetailsProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "ViewServiceDetails"
>;
const ViewServiceDetails = ({
  route,
}: ViewServiceDetailsProps): JSX.Element => {
  const { orderId, subOrderId } = route.params;

  const dispatch = useAppDispatch();

  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);

  const {
    uiState: orderDetailUiState,
    member: orderDetail,
    error: orderDetailError,
  } = useAppSelector(selectOrderDetails);

  useEffect(() => {
    if (orderId && subOrderId) {
      dispatch(getOrderDetailsAsync({ orderId, subOrderId }));
    } else {
      return;
    }
  }, [orderId, subOrderId]);

  const Title = ({ text }: { text: string }): JSX.Element => {
    return (
      <Text color={AppColors.DARK_PRIMARY} letterSpacing={1} fontSize={12}>
        {text}
      </Text>
    );
  };

  const ValueText = ({ text }: { text: string | number }): JSX.Element => {
    return (
      <Text
        color={AppColors.SECONDARY}
        textTransform={"uppercase"}
        fontWeight={"semibold"}
      >
        {text}
      </Text>
    );
  };

  const OverviewCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <Title text="OVERVIEW" />
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

        <VStack space={3}>
          <View>
            <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
              SERVICE PROVIDER
            </Text>
            <ValueText text={"Mio Home Services"} />
          </View>
          <View>
            <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
              SERVICE TYPE
            </Text>
            <ValueText text={SERVICES[orderDetail?.serviceId]?.text} />
          </View>

          <HStack justifyContent={"space-between"}>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                SCHEDULED DATE
              </Text>
              <ValueText
                text={`${
                  getReadableDateTime(
                    orderDetail?.appointmentInfo?.appointmentDateTime
                  ).month
                } ${
                  getReadableDateTime(
                    orderDetail?.appointmentInfo?.appointmentDateTime
                  ).date
                }, ${
                  getReadableDateTime(
                    orderDetail?.appointmentInfo?.appointmentDateTime
                  ).year
                }`}
              />
            </VStack>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                TIME SLOT
              </Text>
              <ValueText
                text={
                  getReadableDateTime(
                    orderDetail?.appointmentInfo?.appointmentDateTime
                  ).slot
                }
              />
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    );
  };

  const ServiceDetailsCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <Title text="SERVICE DETAILS" />
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

        <VStack space={3}>
          <HStack justifyContent={"space-between"}>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                PLAN
              </Text>
              <ValueText text={orderDetail?.flags?.plan} />
            </VStack>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                DURATION
              </Text>
              <ValueText text={orderDetail?.flags?.recurringDuration} />
            </VStack>
          </HStack>
          <VStack>
            <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
              PROPERTY DETAILS
            </Text>
            {orderDetail.serviceId === LAWN_CARE_ID && (
              <ValueText text={`${orderDetail.area} SQFT (AREA)`} />
            )}
            {orderDetail.serviceId === HOUSE_CLEANING_ID && (
              <ValueText
                text={`${orderDetail.bedrooms} (BEDROOM) | 
                ${orderDetail.bathrooms} (BATHROOM)`}
              />
            )}
            {orderDetail.serviceId === PEST_CONTROL_ID && (
              <ValueText
                text={`${customer?.addresses[0]?.houseInfo?.pestType?.join(
                  ", "
                )} (PEST TYPE)`}
              />
            )}
            {orderDetail.serviceId === POOL_CLEANING_ID && (
              <ValueText
                text={`${customer?.addresses[0]?.houseInfo?.swimmingPoolType} (POOL TYPE)`}
              />
            )}
          </VStack>
          <View>
            <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
              SERVICE NOTES
            </Text>
            <ValueText
              text={
                orderDetail?.serviceNotes?.length > 0
                  ? orderDetail?.serviceNotes[0]
                  : "-"
              }
            />
          </View>
          <View>
            <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
              SERVICE IMAGES
            </Text>
            <HStack space={2} mt={2}>
              {orderDetail?.serviceImages?.map((image, index) => (
                <Image
                  key={index}
                  source={{
                    width: 80,
                    height: 80,
                    uri: image,
                    cache: "force-cache",
                  }}
                  alt="photo"
                />
              ))}
            </HStack>
          </View>
        </VStack>
      </VStack>
    );
  };

  const AddressCard = (): JSX.Element => {
    return (
      <VStack bg={"white"} mx={3} p={5} borderRadius={10}>
        <Title text="ADDRESS" />
        <Divider my={1} mb={3} borderWidth={1} borderColor={AppColors.EEE} />

        <VStack space={3}>
          <HStack justifyContent={"space-between"}>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                STREET
              </Text>
              <ValueText text={customer?.addresses[0]?.street} />
            </VStack>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                CITY
              </Text>
              <ValueText text={customer?.addresses[0]?.city} />
            </VStack>
          </HStack>
          <HStack justifyContent={"space-between"}>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                STATE
              </Text>
              <ValueText text={customer?.addresses[0]?.state} />
            </VStack>
            <VStack width={"50%"}>
              <Text color={AppColors.AAA} letterSpacing={1} fontSize={12}>
                ZIP
              </Text>
              <ValueText text={customer?.addresses[0]?.zip} />
            </VStack>
          </HStack>
        </VStack>
      </VStack>
    );
  };

  return (
    <AppSafeAreaView
      bg={AppColors.EEE}
      loading={[customerUiState].indexOf(IN_PROGRESS) > 0}
    >
      <ScrollView mt={"1/5"}>
        <VStack space={3} pb={20}>
          <OverviewCard />
          <ServiceDetailsCard />
          <AddressCard />
        </VStack>
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default ViewServiceDetails;
