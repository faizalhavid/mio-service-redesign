import {
  VStack,
  Center,
  Pressable,
  Button,
  Text,
  useContrastText,
  Circle,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { LAWN_CARE } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";

type ServiceButtonProps = {
  icon: string | undefined;
  text: string | undefined;
  status: boolean | undefined;
  onPress: (() => void) | undefined;
  onAdd: (() => void) | undefined;
};

const ServiceButton = ({
  icon,
  text,
  status,
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
          <Circle size={120} bg={AppColors.PRIMARY} p={10}>
            {icon && <SvgCss xml={icon} />}
          </Circle>
          <Text textAlign={"center"} color={AppColors.SECONDARY}>
            {text}
          </Text>
          <Button
            bg={status ? "transparent" : btnColor}
            borderColor={status ? AppColors.SECONDARY : btnColor}
            borderRadius={50}
            borderWidth={1}
            width={75}
            onPress={onAdd}
            _text={{
              color: status ? AppColors.SECONDARY : "white",
            }}
            alignSelf={"center"}
            _pressed={{
              backgroundColor: `${btnColor}E6`,
            }}
          >
            {status ? "Added" : "Add"}
          </Button>
        </VStack>
      </Pressable>
    </>
  );
};

export default ServiceButton;
