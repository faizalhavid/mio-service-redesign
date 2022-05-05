import { HStack, Pressable, Text, VStack } from "native-base";
import React, { useState } from "react";
import { AppColors } from "../../commons/colors";
import { useAppSelector } from "../../hooks/useAppSelector";
import { SERVICES } from "../../screens/Home/ChooseService";
import { selectCustomer } from "../../slices/customer-slice";
import { selectSelectedServices } from "../../slices/service-slice";
import { AddressBottomSheet, AddressMode } from "../AddressBottomSheet";

type FooterButtonProps = {
  type?:
    | "SERVICE_SELECTION"
    | "PLAN_SELECTION"
    | "SCHEDULE_SELECTION"
    | "DATETIME_SELECTION"
    | "ADDRESS";
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  subText?: string;
  disabled?: boolean;
  onPress: () => void;
  onPress2?: () => void;
};

const FooterButton = ({
  type,
  label,
  minLabel,
  maxLabel,
  onPress,
  onPress2,
  disabled,
}: FooterButtonProps): JSX.Element => {
  const [showEditAddress, setShowEditAddress] = useState(false);
  const [addressMode, setAddressMode] = useState<AddressMode>("UPDATE_ADDRESS");
  const { collection: selectedServices, member: selectedService } =
    useAppSelector(selectSelectedServices);
  const { member: customer } = useAppSelector(selectCustomer);
  return (
    <VStack position={"absolute"} bg={"#fff"} bottom={0} width={"100%"}>
      {(type === "SERVICE_SELECTION" || type === "SCHEDULE_SELECTION") && (
        <HStack
          height={42}
          borderTopWidth={1}
          bg={"#fff"}
          borderColor={"#ccc"}
          justifyContent={"space-between"}
          alignItems="center"
          px={5}
        >
          <Text color={"#000"} fontSize="12" fontWeight="semibold">
            HOME{"   "}
            <Text
              color={"#aaa"}
              alignSelf="center"
              fontSize="12"
              fontWeight="semibold"
            >
              {customer?.addresses[0]?.street}, {customer?.addresses[0]?.city},{" "}
              {customer?.addresses[0]?.state}, {customer?.addresses[0]?.zip}
            </Text>
          </Text>
          <Pressable
            height={50}
            justifyContent="center"
            onPress={() => {
              setAddressMode("UPDATE_ADDRESS");
              setShowEditAddress(true);
            }}
          >
            <Text
              alignSelf={"center"}
              color={AppColors.TEAL}
              fontWeight={"semibold"}
              fontSize="12"
            >
              CHANGE
            </Text>
          </Pressable>
        </HStack>
      )}
      <HStack
        height={70}
        borderTopWidth={1}
        bg={"#fff"}
        borderColor={"#ccc"}
        justifyContent={"space-between"}
        alignItems="center"
        px={5}
      >
        {type === "SERVICE_SELECTION" && (
          <Text color={"#aaa"}>
            {selectedServices.length === 0 ? "No" : selectedServices.length}{" "}
            Service Selected
          </Text>
        )}
        {(type === "PLAN_SELECTION" || type === "DATETIME_SELECTION") && (
          <VStack>
            <Text
              fontWeight={"semibold"}
              fontSize={14}
              color={AppColors.DARK_PRIMARY}
            >
              {SERVICES[selectedService].text}
            </Text>
            <Text color={"#aaa"}>Service</Text>
          </VStack>
        )}
        {type === "SCHEDULE_SELECTION" && (
          <VStack>
            <Text color={"#aaa"}>Choose Date & Time</Text>
          </VStack>
        )}
        {type === "ADDRESS" && (
          <VStack alignContent={"center"}>
            <Text fontSize={13} color={"#aaa"}>
              Update Addres &
            </Text>
            <Text fontSize={13} color={"#aaa"}>
              Property Details
            </Text>
          </VStack>
        )}
        <Pressable
          borderColor={disabled ? "#aaa" : AppColors.TEAL}
          backgroundColor={disabled ? "#aaa" : AppColors.TEAL}
          height={50}
          borderRadius={5}
          width={"50%"}
          justifyContent="center"
          borderWidth={1}
          onPress={onPress}
        >
          {minLabel && maxLabel && (
            <VStack>
              <Text
                alignSelf={"center"}
                color={"#fff"}
                fontWeight={"semibold"}
                fontSize="11"
              >
                {minLabel}
              </Text>
              <Text
                alignSelf={"center"}
                color={"#fff"}
                fontWeight={"semibold"}
                fontSize="14"
              >
                {maxLabel}
              </Text>
            </VStack>
          )}
          {label && (
            <Text
              alignSelf={"center"}
              color={"#fff"}
              fontWeight={"semibold"}
              fontSize="14"
            >
              {label}
            </Text>
          )}
        </Pressable>
      </HStack>
      <AddressBottomSheet
        mode={addressMode}
        showEditAddress={showEditAddress}
        setShowEditAddress={setShowEditAddress}
      />
    </VStack>
  );
};

export default FooterButton;
