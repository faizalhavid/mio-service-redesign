import { Button, Text } from "native-base";
import React from "react";
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
      shadow={1}
      width={"95%"}
      bg={"#fff"}
      borderColor={"#eee"}
      alignSelf={"center"}
      onPress={onPress}
    >
      <Text
        color={AppColors.SECONDARY}
        px={4}
        fontSize={12}
        fontWeight={"semibold"}
      >
        {title}
      </Text>
    </Button>
  );
};

export default ChooseServiceDetailsButton;
