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
import OrderSummary from "../../components/OrderSummary";
import ServiceButton from "../../components/ServiceButton";
import { navigate } from "../../navigations/rootNavigation";

const LAWN_CARE_TEXT: string = "Lawn Care";
const POOL_CLEANING_TEXT: string = "Pool Cleaning";
const HOUSE_CLEANING_TEXT: string = "House Cleaning";
const PEST_CONTROL_TEXT: string = "Pest Control";

export type ServicesType = {
  icon: (color?: string) => string;
  text: string;
  description: string;
};

export const SERVICES: { [key: string]: ServicesType } = {
  [LAWN_CARE_TEXT]: {
    icon: (color: string = "white") => LAWN_CARE(color),
    text: LAWN_CARE_TEXT,
    description:
      "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
  },
  [POOL_CLEANING_TEXT]: {
    icon: (color: string = "white") => POOL_CLEANING(color),
    text: POOL_CLEANING_TEXT,
    description:
      "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
  },
  [HOUSE_CLEANING_TEXT]: {
    icon: (color: string = "white") => HOUSE_CLEANING(color),
    text: HOUSE_CLEANING_TEXT,
    description:
      "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
  },
  [PEST_CONTROL_TEXT]: {
    icon: (color: string = "white") => PEST_CONTROL(color),
    text: PEST_CONTROL_TEXT,
    description:
      "Give your lawn the boost it needs without all of the work. Our providers will bring the best of your yard.",
  },
};

const ChooseService = (): JSX.Element => {
  const [toggleServiceInfo, setToggleServiceInfo] = React.useState(false);

  const [selectedServiceInfo, setSelectedServiceInfo] =
    React.useState<ServicesType>();

  const [selectedServices, setSelectedServices] = React.useState<string[]>([]);

  const [summaryHeight, setSummaryHeight] = React.useState<number>(75);

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
              (service, index) => (
                <ServiceButton
                  key={index}
                  icon={service?.icon()}
                  text={service?.text}
                  status={selectedServices.indexOf(service?.text) >= 0}
                  onAdd={() => chooseService(service?.text)}
                  onPress={() => showServiceInfo(service?.text)}
                />
              )
            )}
          </HStack>
          <HStack justifyContent="center" space={5}>
            {[SERVICES[HOUSE_CLEANING_TEXT], SERVICES[PEST_CONTROL_TEXT]].map(
              (service, index) => (
                <ServiceButton
                  key={index}
                  icon={service?.icon()}
                  text={service?.text}
                  status={selectedServices.indexOf(service?.text) >= 0}
                  onAdd={() => chooseService(service?.text)}
                  onPress={() => showServiceInfo(service?.text)}
                />
              )
            )}
          </HStack>
        </VStack>
      </VStack>
      <OrderSummary selectedServices={selectedServices} />
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
                    <SvgCss xml={selectedServiceInfo?.icon()} />
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
        label="CHOOSE SERVICE"
        subText="Provide service details in next step"
        onPress={() => navigate("ServiceDetails", { mode: "EDIT" })}
      />
    </>
  );
  return <AppSafeAreaView>{content}</AppSafeAreaView>;
};

export default ChooseService;
