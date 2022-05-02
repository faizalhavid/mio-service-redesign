import { HStack, VStack, Spacer, Text, Pressable } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { FILLED_CIRCLE_ICON, STAR_ICON } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { navigate } from "../../navigations/rootNavigation";
import { ServicesType } from "../../screens/Home/ChooseService";
import {
  selectSelectedServices,
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
    navigate("ChoosePlan");
    // // toggleServiceInfoSheet(serviceId);
  };

  const { collection: selectedServices } = useAppSelector(
    selectSelectedServices
  );

  const Tag = (name: string) => {
    return (
      <Text
        alignSelf={"center"}
        color={AppColors.AAA}
        borderColor={AppColors.CCC}
        borderWidth={1}
        borderRadius={5}
        fontWeight={"semibold"}
        fontSize={12}
        px={2}
      >
        {name}
      </Text>
    );
  };

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
      <HStack alignContent={"space-between"} justifyContent={"space-between"}>
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
              Starts at $45
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
                  updateSelectedServices({
                    selectedService: service?.id,
                  })
                );
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
          <HStack space={2}>
            {Tag("24 Sqft")}
            {Tag("BASIC")}
            {Tag("$40/Week")}
          </HStack>
          <HStack space={2} mt={2}>
            {Tag("Fri, Apr 27")}
            {Tag("2 PM - 6 PM")}
          </HStack>
          {datetime && (
            <>
              <Spacer
                borderWidth={0.5}
                width={"100%"}
                my={2}
                borderColor="#eee"
                borderRadius={5}
              />
              <Pressable
                height={8}
                borderRadius={5}
                justifyContent="center"
                onPress={() => {
                  navigate("ChooseDateTime");
                }}
                width={"100%"}
                bg={AppColors.TEAL}
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
                  color={"white"}
                  fontWeight={"semibold"}
                  fontSize={14}
                >
                  Choose Date & Time
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
