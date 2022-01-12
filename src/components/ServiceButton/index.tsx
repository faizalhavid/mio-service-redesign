import {
  VStack,
  Center,
  Pressable,
  Button,
  Text,
  useContrastText,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { LAWN_CARE } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";

type ServiceButtonProps = {
  icon: string | undefined;
  text: string | undefined;
  onPress: (() => void) | undefined;
  onAdd: (() => void) | undefined;
};

const ServiceButton = ({
  icon,
  text,
  onAdd,
  onPress,
}: ServiceButtonProps): JSX.Element => {
  const btnColor = AppColors.DARK_PRIMARY;
  return (
    <>
      <Pressable
        _pressed={{
          backgroundColor: `#eee`,
        }}
        justifyContent={"center"}
        p={5}
        borderRadius={10}
        onPress={onPress}
      >
        <VStack space="2">
          {icon && <SvgCss xml={icon} />}
          <Text textAlign={"center"} color={AppColors.SECONDARY}>
            {text}
          </Text>
          <Button
            bg={btnColor}
            borderColor={btnColor}
            borderRadius={50}
            width={75}
            onPress={onAdd}
            _text={{
              color: "white",
            }}
            alignSelf={"center"}
            _pressed={{
              backgroundColor: `${btnColor}E6`,
            }}
          >
            Add
          </Button>
        </VStack>
      </Pressable>
    </>
  );
};

export default ServiceButton;
