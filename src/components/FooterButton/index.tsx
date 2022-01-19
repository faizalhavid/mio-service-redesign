import {
  ArrowForwardIcon,
  Button,
  CheckIcon,
  ChevronRightIcon,
  HStack,
  Icon,
  InfoIcon,
  Text,
  useContrastText,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type FooterButtonProps = {
  label: string;
  subText?: string;
  onPress: () => void;
};

const FooterButton = ({
  label,
  subText,
  onPress,
}: FooterButtonProps): JSX.Element => {
  return (
    <>
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
        {subText && (
          <Text
            alignSelf={"center"}
            fontSize={12}
            fontWeight={"semibold"}
            color={"teal.100"}
          >
            ({subText})
          </Text>
        )}
      </Button>
    </>
  );
};

export default FooterButton;
