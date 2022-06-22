import { HStack, VStack, Spacer, Text, Pressable } from "native-base";
import React, { useEffect, useMemo, useState } from "react";
import { SvgCss } from "react-native-svg";
import { FILLED_CIRCLE_ICON, STAR_ICON } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import { LeadDetails, SubOrder } from "../../commons/types";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { navigate } from "../../navigations/rootNavigation";
import {
  HOUSE_CLEANING_ID,
  LAWN_CARE_ID,
  ServicesType,
} from "../../screens/Home/ChooseService";
import { getServiceDetails } from "../../services/service-details";
import { deepClone, getReadableDateTime } from "../../services/utils";
import { selectCustomer } from "../../slices/customer-slice";
import { selectLead, updateLeadAsync } from "../../slices/lead-slice";
import {
  removeSelectedServices,
  selectSelectedServices,
  selectServices,
  setActiveService,
  updateSelectedServices,
} from "../../slices/service-slice";

type ServiceComboCardProps = {
  service: ServicesType;
  remove?: boolean;
  datetime?: boolean;
};

const ServiceComboCard = ({
  service,
  remove,
  datetime,
}: ServiceComboCardProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const chooseService = async (serviceId: string = "") => {
    dispatch(setActiveService({ selectedService: serviceId }));

    navigate("ChoosePlan", {
      serviceId,
      mode: ~selectedServices.indexOf(service?.id) ? "UPDATE" : "CREATE",
    });
    // // toggleServiceInfoSheet(serviceId);
  };

  const { uiState: leadUiState, member: leadDetails } =
    useAppSelector(selectLead);

  const { collection: selectedServices } = useAppSelector(
    selectSelectedServices
  );

  const { groupedServiceDetails } = getServiceDetails();

  const [weeklyPrice, setWeeklyPrice] = useState(0);

  const { member: customer } = useAppSelector(selectCustomer);
  const [groupedLeadDetails, setGroupedLeadDetails] = useState<{
    [key: string]: SubOrder;
  }>({});

  useEffect(() => {
    if (weeklyPrice) return;
    let price: number = groupedServiceDetails[service?.id]?.priceMap.reduce(
      (updatedValue, price) => {
        if (
          service?.id === LAWN_CARE_ID &&
          price.rangeMin !== undefined &&
          price.rangeMax !== undefined
        ) {
          let lotSize = customer?.addresses[0]?.houseInfo?.lotSize || 0;
          if (!(lotSize >= price.rangeMin && lotSize <= price.rangeMax)) {
            return updatedValue;
          }
        }
        if (
          service?.id === HOUSE_CLEANING_ID &&
          price.bedrooms !== undefined &&
          price.bathrooms !== undefined
        ) {
          if (
            customer?.addresses[0]?.houseInfo?.bedrooms !== price.bedrooms ||
            customer?.addresses[0]?.houseInfo?.bathrooms !== price.bathrooms
          ) {
            return updatedValue;
          }
        }
        if (
          price.pricePerWeek &&
          (updatedValue === 0 || Number(price.pricePerWeek) < updatedValue)
        ) {
          updatedValue = Number(price.pricePerWeek);
        } else if (
          price.pricePer2Weeks &&
          (updatedValue === 0 || Number(price.pricePer2Weeks) < updatedValue)
        ) {
          updatedValue = Number(price.pricePer2Weeks);
        } else if (
          price.pricePerMonth &&
          (updatedValue === 0 || Number(price.pricePerMonth) < updatedValue)
        ) {
          updatedValue = Number(price.pricePerMonth);
        }
        return updatedValue;
      },
      0
    );
    setWeeklyPrice(price);
  }, [groupedServiceDetails, service?.id]);

  React.useEffect(() => {
    if (!leadDetails || Object.keys(leadDetails).length === 0) {
      return;
    }
    let details: { [key: string]: SubOrder } = {};
    leadDetails.subOrders.forEach((subOrder) => {
      details[subOrder.serviceId] = subOrder;
    });

    setGroupedLeadDetails(details);
  }, [leadDetails]);

  const Tag = (name: string) => {
    return (
      <Text
        alignSelf={"center"}
        color={AppColors.AAA}
        borderColor={AppColors.CCC}
        borderWidth={1}
        borderRadius={5}
        fontWeight={"semibold"}
        fontSize={11}
        px={2}
        mb={1}
      >
        {name}
      </Text>
    );
  };

  const readableDateTime = useMemo(() => {
    if (
      Object.keys(groupedLeadDetails).length === 0 ||
      !groupedLeadDetails[service?.id]?.appointmentInfo?.appointmentDateTime
    ) {
      return {
        date: "",
        day: "",
        slot: "",
      };
    }
    return getReadableDateTime(
      groupedLeadDetails[service?.id]?.appointmentInfo?.appointmentDateTime
    );
  }, [groupedLeadDetails]);

  return (
    <VStack
      alignSelf="center"
      width={"95%"}
      borderRadius={8}
      bg={"#fff"}
      borderColor={AppColors.TEAL}
      borderWidth={selectedServices.indexOf(service?.id) >= 0 ? 1 : 0}
      p={5}
      mx={5}
    >
      <HStack
        key={Math.random()}
        alignContent={"space-between"}
        justifyContent={"space-between"}
      >
        <VStack space={1} justifyContent={"center"} alignItems={"flex-start"}>
          <Text color={AppColors.DARK_TEAL} fontWeight={"semibold"}>
            {service?.text}
          </Text>
          <HStack justifyContent={"center"} alignItems="center" space={1}>
            <SvgCss xml={FILLED_CIRCLE_ICON("#ccc")} width={4} height={4} />
            <Text color={"#aaa"}>120 Mins </Text>
            <SvgCss xml={FILLED_CIRCLE_ICON("#ccc")} width={4} height={4} />
            <Text color={"#aaa"}>4.9</Text>

            <SvgCss xml={STAR_ICON("#ccc")} width={15} height={15} />
          </HStack>
          {selectedServices.indexOf(service?.id) === -1 && (
            <Text color={AppColors.DARK_PRIMARY} fontWeight={"semibold"}>
              Starts at ${weeklyPrice}
            </Text>
          )}
        </VStack>
        <VStack alignItems={"flex-end"}>
          <Pressable
            height={7}
            borderRadius={5}
            justifyContent="center"
            onPress={() => {
              chooseService(service?.id);
            }}
            width={selectedServices.indexOf(service?.id) >= 0 ? 100 : 50}
            borderColor={AppColors.TEAL}
            borderWidth={1}
            _pressed={{
              borderColor: AppColors.TEAL,
              borderWidth: 1,
              backgroundColor: AppColors.LIGHT_TEAL,
            }}
          >
            <Text
              alignSelf={"center"}
              color={AppColors.TEAL}
              fontWeight={"semibold"}
              fontSize={12}
            >
              {selectedServices.indexOf(service?.id) >= 0
                ? "CHANGE PLAN"
                : "ADD"}
            </Text>
          </Pressable>
          {selectedServices.indexOf(service?.id) >= 0 ? (
            <Pressable
              height={5}
              borderRadius={5}
              px={2}
              justifyContent="center"
              onPress={() => {
                dispatch(
                  removeSelectedServices({
                    selectedService: service?.id,
                  })
                );
                let _leadDetails: LeadDetails = deepClone(leadDetails);
                _leadDetails.subOrders = _leadDetails.subOrders.filter(
                  (lead) => lead.serviceId !== service?.id
                );
                dispatch(updateLeadAsync(_leadDetails));
              }}
              _pressed={{
                backgroundColor: "red.100",
              }}
            >
              {remove && (
                <Text
                  alignSelf={"center"}
                  color={"red.300"}
                  fontWeight={"semibold"}
                  fontSize={10}
                >
                  REMOVE
                </Text>
              )}
            </Pressable>
          ) : (
            <></>
          )}
        </VStack>
      </HStack>
      {selectedServices.indexOf(service?.id) >= 0 && (
        <>
          <Spacer
            borderWidth={0.5}
            width={"100%"}
            my={1}
            mb={2}
            borderColor="#eee"
            borderRadius={5}
          />
          <HStack space={2} flexWrap="wrap">
            {service?.id === LAWN_CARE_ID &&
              Tag(`${customer?.addresses[0]?.houseInfo?.lotSize} Sq Ft`)}
            {service?.id === HOUSE_CLEANING_ID &&
              Tag(`${customer?.addresses[0]?.houseInfo?.bedrooms} Bedroom`)}
            {service?.id === HOUSE_CLEANING_ID &&
              Tag(`${customer?.addresses[0]?.houseInfo?.bathrooms} Bathroom`)}
            {Tag(`${groupedLeadDetails[service?.id]?.flags?.plan}`)}
            {Tag(
              `$${groupedLeadDetails[service?.id]?.servicePrice?.cost}/${
                groupedLeadDetails[service?.id]?.flags?.recurringDuration
              }`
            )}
          </HStack>
          {groupedLeadDetails[service?.id]?.appointmentInfo
            ?.appointmentDateTime && (
            <HStack key={Math.random()} space={2} mt={2}>
              {Tag(`${readableDateTime?.day}, ${readableDateTime?.date}`)}
              {Tag(readableDateTime?.slot)}
            </HStack>
          )}
          {datetime && (
            <>
              <Spacer
                key={Math.random()}
                borderWidth={0.5}
                width={"100%"}
                my={2}
                borderColor="#eee"
                borderRadius={5}
              />
              <Pressable
                key={Math.random()}
                height={8}
                borderRadius={5}
                justifyContent="center"
                onPress={() => {
                  dispatch(setActiveService({ selectedService: service?.id }));
                  if (
                    groupedLeadDetails[service?.id]?.appointmentInfo
                      ?.appointmentDateTime
                  ) {
                    navigate("ChooseDateTime", {
                      serviceId: service?.id,
                      mode: "UPDATE",
                    });
                  } else {
                    navigate("ChooseDateTime", {
                      serviceId: service?.id,
                      mode: "CREATE",
                    });
                  }
                }}
                width={"100%"}
                bg={readableDateTime.date ? "white" : AppColors.TEAL}
                borderColor={AppColors.TEAL}
                borderWidth={1}
                _pressed={{
                  borderColor: AppColors.LIGHT_TEAL,
                  borderWidth: 1,
                  backgroundColor: AppColors.LIGHT_TEAL,
                }}
              >
                <Text
                  alignSelf={"center"}
                  color={readableDateTime.date ? AppColors.TEAL : "white"}
                  fontWeight={"semibold"}
                  fontSize={14}
                >
                  {" "}
                  {`${readableDateTime.date ? "Update" : "Choose"} Date & Time`}
                </Text>
              </Pressable>
            </>
          )}
        </>
      )}
    </VStack>
  );
};

export default ServiceComboCard;
