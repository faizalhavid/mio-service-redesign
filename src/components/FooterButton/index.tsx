import {
  Button,
  HStack,
  Pressable,
  Text,
  useContrastText,
  VStack,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import { useAppSelector } from "../../hooks/useAppSelector";
import { navigate } from "../../navigations/rootNavigation";
import {
  selectSelectedServices,
  selectServices,
} from "../../slices/service-slice";

type FooterButtonProps = {
  label: string;
  subText?: string;
  disabled?: boolean;
  v2?: boolean;
  onPress: (param?: any) => void;
};

const FooterButton = ({
  label,
  subText,
  onPress,
  v2,
  disabled,
}: FooterButtonProps): JSX.Element => {
  const { collection: selectedServices } = useAppSelector(
    selectSelectedServices
  );
  return (
    <>
      {!v2 && (
        <Button
          borderRadius={0}
          position={"absolute"}
          bottom={0}
          _pressed={{
            backgroundColor: AppColors.DARK_PRIMARY,
          }}
          disabled={disabled}
          backgroundColor={disabled ? "gray.400" : AppColors.SECONDARY}
          height={75}
          width={"100%"}
          onPress={onPress}
        >
          <HStack space={0} alignItems="center" alignSelf={"center"}>
            <Text
              alignSelf={"center"}
              fontSize={16}
              fontWeight={"semibold"}
              color={useContrastText(AppColors.SECONDARY)}
            >
              {label}
            </Text>
            {/* <ChevronRightIcon size="8" color={"white"} /> */}
          </HStack>
          {disabled && subText && (
            <Text
              alignSelf={"center"}
              fontSize={12}
              fontWeight={"semibold"}
              color={useContrastText(AppColors.SECONDARY)}
            >
              {subText}
            </Text>
          )}
        </Button>
      )}
      {v2 && (
        <VStack>
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
            <Pressable
              // borderColor={AppColors.TEAL}
              height={50}
              justifyContent="center"
              onPress={() => {
                console.log("Add");
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
          <HStack
            height={70}
            borderTopWidth={1}
            bg={"#fff"}
            borderColor={"#ccc"}
            justifyContent={"space-between"}
            alignItems="center"
            px={5}
          >
            <Text color={"#aaa"}>
              {selectedServices.length === 0 ? "No" : selectedServices.length}{" "}
              Service Selected
            </Text>
            <Pressable
              // borderColor={AppColors.TEAL}
              borderColor="#aaa"
              height={50}
              borderRadius={5}
              width={"50%"}
              justifyContent="center"
              borderWidth={1}
              onPress={() => {
                console.log("Add");
              }}
              backgroundColor="#aaa"
            >
              <VStack>
                <Text
                  alignSelf={"center"}
                  // color={AppColors.TEAL}
                  color={"#fff"}
                  fontWeight={"semibold"}
                  fontSize="12"
                >
                  CHOOSE
                </Text>
                <Text
                  alignSelf={"center"}
                  // color={AppColors.TEAL}
                  color={"#fff"}
                  fontWeight={"semibold"}
                  fontSize="14"
                >
                  SCHEDULE
                </Text>
              </VStack>
            </Pressable>
            {/* <Button
            borderRadius={8}
            // position={"absolute"}
            // bottom={2}
            // left={"50%"}
            backgroundColor={AppColors.SECONDARY}
            // height={60}
            width={"40%"}
            onPress={onPress}
          >
            <HStack space={0} alignItems="center" alignSelf={"center"}>
              <Text
                alignSelf={"center"}
                fontSize={16}
                fontWeight={"semibold"}
                color={useContrastText(AppColors.SECONDARY)}
              >
                {label}
              </Text>
            </HStack>
          </Button> */}
          </HStack>
        </VStack>
      )}
    </>
  );
};

export default FooterButton;
