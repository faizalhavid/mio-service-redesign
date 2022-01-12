import {
  Actionsheet,
  Button,
  HStack,
  Text,
  useDisclose,
  View,
  VStack,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import {
  HOUSE_CLEANING,
  LAWN_CARE,
  PEST_CONTROL,
  POOL_CLEANING,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import ServiceButton from "../../components/ServiceButton";
import { navigate } from "../../navigations/rootNavigation";

type ServicesType = {
  icon: string;
  text: string;
  description: string;
  onAdd: () => void;
  onPress: () => void;
};

const ChooseService = (): JSX.Element => {
  const [toggleServiceInfo, setToggleServiceInfo] = React.useState(false);

  const [selectedServiceInfo, setSelectedServiceInfo] =
    React.useState<ServicesType>();

  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  const LAWN_CARE_TEXT: string = "Lawn Care";
  const POOL_CLEANING_TEXT: string = "Pool Cleaning";
  const HOUSE_CLEANING_TEXT: string = "House Cleaning";
  const PEST_CONTROL_TEXT: string = "Pest Control";

  const SERVICES: { [key: string]: ServicesType } = {
    [LAWN_CARE_TEXT]: {
      icon: LAWN_CARE,
      text: LAWN_CARE_TEXT,
      description:
        "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
      onAdd: () => chooseService(LAWN_CARE_TEXT),
      onPress: () => showServiceInfo(LAWN_CARE_TEXT),
    },
    [POOL_CLEANING_TEXT]: {
      icon: POOL_CLEANING,
      text: POOL_CLEANING_TEXT,
      description:
        "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
      onAdd: () => chooseService(POOL_CLEANING_TEXT),
      onPress: () => showServiceInfo(POOL_CLEANING_TEXT),
    },
    [HOUSE_CLEANING_TEXT]: {
      icon: POOL_CLEANING,
      text: HOUSE_CLEANING_TEXT,
      description:
        "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
      onAdd: () => chooseService(HOUSE_CLEANING_TEXT),
      onPress: () => showServiceInfo(HOUSE_CLEANING_TEXT),
    },
    [PEST_CONTROL_TEXT]: {
      icon: POOL_CLEANING,
      text: PEST_CONTROL_TEXT,
      description:
        "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
      onAdd: () => chooseService(PEST_CONTROL_TEXT),
      onPress: () => showServiceInfo(PEST_CONTROL_TEXT),
    },
  };

  const chooseService = (serviceName: string = "") => {
    if (~selectedServices.indexOf(serviceName)) {
      return;
    }
    setSelectedServices([...selectedServices, serviceName]);
  };

  const showServiceInfo = (serviceName: string) => {
    setSelectedServiceInfo(SERVICES[serviceName]);
    setToggleServiceInfo(true);
  };

  const content = (
    <>
      <VStack paddingX={5} mt={5} space={5}>
        <Text textAlign={"center"} fontSize={20}>
          Which services are {"\n"} you interested in?
        </Text>
        <VStack space={0}>
          <HStack justifyContent="center" space={5}>
            {[SERVICES[LAWN_CARE_TEXT], SERVICES[POOL_CLEANING_TEXT]].map(
              (service) => (
                <ServiceButton
                  key={service?.text}
                  icon={service?.icon}
                  text={service?.text}
                  onAdd={service?.onAdd}
                  onPress={service?.onPress}
                />
              )
            )}
          </HStack>
          <HStack justifyContent="center" space={5}>
            {[SERVICES[HOUSE_CLEANING_TEXT], SERVICES[PEST_CONTROL_TEXT]].map(
              (service) => (
                <ServiceButton
                  key={service?.text}
                  icon={service?.icon}
                  text={service?.text}
                  onAdd={service?.onAdd}
                  onPress={service?.onPress}
                />
              )
            )}
          </HStack>
        </VStack>
      </VStack>
      <Actionsheet
        isOpen={toggleServiceInfo}
        onClose={() => setToggleServiceInfo(false)}
      >
        <Actionsheet.Content>
          <HStack justifyContent="center" space={5}>
            <VStack space="5" p={10}>
              <View alignSelf={"center"}>
                {selectedServiceInfo?.icon && (
                  <SvgCss xml={selectedServiceInfo?.icon} />
                )}
              </View>
              <Text
                textAlign={"center"}
                color={AppColors.SECONDARY}
                fontWeight={"bold"}
                fontSize={16}
              >
                {selectedServiceInfo?.text}
              </Text>
              <Text
                textAlign={"center"}
                fontSize={14}
                color={AppColors.SECONDARY}
              >
                {selectedServiceInfo?.description}
              </Text>
              <Button
                mt={5}
                bg={AppColors.DARK_PRIMARY}
                borderColor={AppColors.DARK_PRIMARY}
                borderRadius={50}
                width={"100%"}
                height={50}
                onPress={() => {
                  chooseService(selectedServiceInfo?.text);
                  setToggleServiceInfo(false);
                }}
                _text={{
                  color: "white",
                }}
                alignSelf={"center"}
                _pressed={{
                  backgroundColor: `${AppColors.DARK_PRIMARY}E6`,
                }}
              >
                Add
              </Button>
            </VStack>
          </HStack>
        </Actionsheet.Content>
      </Actionsheet>
      <FooterButton
        label="SAVE & CONTINUE"
        onPress={() => navigate("ChooseService")}
      />
    </>
  );
  return <AppSafeAreaView>{content}</AppSafeAreaView>;
};

export default ChooseService;
