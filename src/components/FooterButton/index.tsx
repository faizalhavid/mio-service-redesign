import {
  ArrowForwardIcon,
  Button,
  CheckIcon,
  ChevronRightIcon,
  Divider,
  HStack,
  Icon,
  InfoIcon,
  Pressable,
  Stack,
  Text,
  useContrastText,
  VStack,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { AppColors } from "../../commons/colors";
import { navigate } from "../../navigations/rootNavigation";
import { SERVICES } from "../../screens/Home/ChooseService";

type FooterButtonProps = {
  label: string;
  subText?: string;
  v2?: boolean;
  onPress: () => void;
};

const FooterButton = ({
  label,
  subText,
  onPress,
  v2,
}: FooterButtonProps): JSX.Element => {
  return (
    <>
      {!v2 && (
        <Button
          borderRadius={0}
          position={"absolute"}
          bottom={0}
          backgroundColor={AppColors.SECONDARY}
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
          {/* {subText && (
          <Text
            alignSelf={"center"}
            fontSize={12}
            fontWeight={"semibold"}
            color={"teal.100"}
          >
            ({subText})
          </Text>
        )} */}
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
              navigate("ServiceDetails", { mode: "PREVIEW" });
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
