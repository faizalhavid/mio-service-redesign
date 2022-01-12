import {
  Actionsheet,
  Button,
  Circle,
  Divider,
  HStack,
  Text,
  useDisclose,
  View,
  Pressable,
  VStack,
} from "native-base";
import React from "react";
import { SvgCss, SvgXml } from "react-native-svg";
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

  const [summaryHeight, setSummaryHeight] = React.useState<number>(75);

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
      icon: HOUSE_CLEANING,
      text: HOUSE_CLEANING_TEXT,
      description:
        "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
      onAdd: () => chooseService(HOUSE_CLEANING_TEXT),
      onPress: () => showServiceInfo(HOUSE_CLEANING_TEXT),
    },
    [PEST_CONTROL_TEXT]: {
      icon: PEST_CONTROL,
      text: PEST_CONTROL_TEXT,
      description:
        "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
      onAdd: () => chooseService(PEST_CONTROL_TEXT),
      onPress: () => showServiceInfo(PEST_CONTROL_TEXT),
    },
  };

  const chooseService = (serviceName: string = "") => {
    let pos = selectedServices.indexOf(serviceName);
    if (~pos) {
      selectedServices.splice(pos, 1);
      setSelectedServices([...selectedServices]);
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
      <VStack mt={5} space={5}>
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
                  status={selectedServices.indexOf(service?.text) >= 0}
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
                  status={selectedServices.indexOf(service?.text) >= 0}
                  onAdd={service?.onAdd}
                  onPress={service?.onPress}
                />
              )
            )}
          </HStack>
        </VStack>
      </VStack>
      <Pressable
        bg={"teal.600"}
        position={"absolute"}
        bottom={75}
        height={85}
        width={"100%"}
        _pressed={{
          backgroundColor: "teal.500",
        }}
        onPress={() => {
          console.log("hi");
        }}
      >
        <VStack>
          <HStack justifyContent={"space-between"}>
            <Text color={"white"} py={2} px={2}>
              Order Summary
            </Text>
            <Text color={"white"} py={2} px={2}>
              More
            </Text>
          </HStack>
          <HStack space={3} px={2}>
            {selectedServices.map((service) => (
              <>
                <HStack
                  space={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <SvgCss xml={SERVICES[service].icon} width={30} height={30} />
                  <Text color={"white"}>
                    {SERVICES[service].text.split(" ")[0]}
                  </Text>
                </HStack>
              </>
            ))}
          </HStack>
        </VStack>
      </Pressable>
      <Actionsheet
        isOpen={toggleServiceInfo}
        onClose={() => setToggleServiceInfo(false)}
      >
        <Actionsheet.Content>
          <HStack justifyContent="center" space={5}>
            <VStack space="5" p={10}>
              <View alignSelf={"center"}>
                {selectedServiceInfo?.icon && (
                  <Circle size={120} bg={AppColors.PRIMARY} p={10}>
                    <SvgCss xml={selectedServiceInfo?.icon} />
                  </Circle>
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
