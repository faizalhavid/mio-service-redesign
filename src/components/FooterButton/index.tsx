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
import { navigate } from "../../navigations/rootNavigation";

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
        <HStack
          height={70}
          p={10}
          borderTopWidth={1}
          shadow={3}
          bg={"#fff"}
          borderColor={AppColors.SECONDARY}
          justifyContent={"space-between"}
        >
          <Pressable
            position={"absolute"}
            bg={"#fff"}
            bottom={5}
            height={60}
            width={"50%"}
            p={1}
            alignSelf={"center"}
            _pressed={{
              backgroundColor: "teal.100",
            }}
            onPress={() => {
              navigate("ServiceDetails");
            }}
          >
            <VStack>
              <VStack justifyContent={"space-between"}>
                <Text color={AppColors.SECONDARY} px={2}>
                  Order Summary
                </Text>
                <Text color={AppColors.SECONDARY} px={2}>
                  $ -
                </Text>
              </VStack>
            </VStack>
          </Pressable>
          <Button
            borderRadius={8}
            position={"absolute"}
            bottom={2}
            left={"50%"}
            backgroundColor={AppColors.SECONDARY}
            height={60}
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
          </Button>
        </HStack>
      )}
    </>
  );
};

export default FooterButton;
