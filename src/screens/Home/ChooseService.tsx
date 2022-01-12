import {
  Center,
  Divider,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { SvgCss, SvgCssUri, SvgXml } from "react-native-svg";
import {
  HOUSE_CLEANING,
  LAWN_CARE,
  PEST_CONTROL,
  POOL_CLEANING,
} from "../../commons/assets";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import ServiceButton from "../../components/ServiceButton";
import { navigate } from "../../navigations/rootNavigation";

const content = (
  <>
    <VStack paddingX={5} mt={10} space={10}>
      <Text textAlign={"center"} fontSize={20}>
        Which services are {"\n"} you interested in?
      </Text>
      <VStack space={0}>
        <HStack justifyContent="center" space={5}>
          <ServiceButton
            icon={LAWN_CARE}
            text="Lawn Care"
            onAdd={() => {}}
            onPress={() => {}}
          />
          <ServiceButton
            icon={POOL_CLEANING}
            text="Pool Cleaning"
            onAdd={() => {}}
            onPress={() => {}}
          />
        </HStack>
        <HStack justifyContent="center" space={5}>
          <ServiceButton
            icon={HOUSE_CLEANING}
            text="House Cleaning"
            onAdd={() => {}}
            onPress={() => {}}
          />
          <ServiceButton
            icon={PEST_CONTROL}
            text="Pest Control"
            onAdd={() => {}}
            onPress={() => {}}
          />
        </HStack>
      </VStack>
    </VStack>
    <FooterButton
      label="SAVE & CONTINUE"
      onPress={() => navigate("ChooseService")}
    />
  </>
);

const ChooseService = (): JSX.Element => {
  return <AppSafeAreaView content={content} />;
};

export default ChooseService;
