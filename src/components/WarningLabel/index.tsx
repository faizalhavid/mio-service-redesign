import { Button, HStack, Text } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import { navigate } from "../../navigations/rootNavigation";

type WarningLabelProps = {
  text: string;
  onPress: () => void;
};

const WarningLabel = ({ text, onPress }: WarningLabelProps): JSX.Element => {
  return (
    <>
      <HStack
        my={2}
        // borderWidth={1}
        // borderRadius={7}
        bg={AppColors.LIGHT_TEAL}
        borderColor={AppColors.TEAL}
        px={5}
        py={2}
        justifyContent="space-between"
        alignItems={"center"}
      >
        <Text color={AppColors.SECONDARY} fontSize={14} fontWeight={"semibold"}>
          {text}
        </Text>
        <Button bg={AppColors.SECONDARY} onPress={onPress}>
          Update
        </Button>
      </HStack>
    </>
  );
};

export default WarningLabel;
