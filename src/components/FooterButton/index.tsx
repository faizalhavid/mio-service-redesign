import { HStack, Pressable, Text, VStack } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSelectedServices } from "../../slices/service-slice";

type FooterButtonProps = {
  type?:
    | "SERVICE_SELECTION"
    | "PLAN_SELECTION"
    | "SCHEDULE_SELECTION"
    | "DATETIME_SELECTION";
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
  const { collection: selectedServices } = useAppSelector(
    selectSelectedServices
  );
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
              21 Keen Ln, Hoston, Texas - 600117
            </Text>
          </Text>
          <Pressable height={50} justifyContent="center" onPress={onPress2}>
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
        {type === "PLAN_SELECTION" && (
          <VStack>
            <Text color={"#aaa"}>WEEKLY</Text>
            <Text color={"#aaa"}>BASIC</Text>
          </VStack>
        )}
        {type === "DATETIME_SELECTION" && (
          <VStack>
            <Text color={"#aaa"}>FRI, APR 27</Text>
            <Text color={"#aaa"}>2 PM - 6 PM</Text>
          </VStack>
        )}
        {type === "SCHEDULE_SELECTION" && (
          <VStack>
            <Text color={"#aaa"}>Choose Date & Time</Text>
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
          {(type === "SERVICE_SELECTION" || type === "SCHEDULE_SELECTION") && (
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
          {(type === "PLAN_SELECTION" || type === "DATETIME_SELECTION") && (
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
    </VStack>
  );
};

export default FooterButton;
