import { Button, HStack, Text } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { DOTTED_PLUS_ICON, PLUS_ICON } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";

type ChooseServiceDetailsButtonProps = {
  title: string;
  onPress: () => void;
};

const ChooseServiceDetailsButton = ({
  title,
  onPress,
}: ChooseServiceDetailsButtonProps): JSX.Element => {
  return (
    <Button
      variant={"ghost"}
      borderRadius={5}
      _pressed={{
        backgroundColor: "#eee",
      }}
      shadow={0}
      width={"95%"}
      bg={"#fff"}
      alignSelf={"center"}
      borderColor={"#eee"}
      onPress={onPress}
    >
      <HStack space={2} alignItems={"center"} pl={2}>
        <SvgCss
          xml={DOTTED_PLUS_ICON(AppColors.SECONDARY)}
          width={15}
          height={15}
        />
        <Text color={AppColors.SECONDARY} fontWeight="semibold" fontSize={12}>
          {title}
        </Text>
      </HStack>
    </Button>
  );
};

export default ChooseServiceDetailsButton;
