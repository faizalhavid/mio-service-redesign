import { Button, Center, Flex, ScrollView, Text, VStack } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { BOOKING_SUCCESS } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { popToPop } from "../../navigations/rootNavigation";

const Booked = (): JSX.Element => {
  return (
    <AppSafeAreaView>
      <ScrollView mt={10}>
        <VStack space={10} mt={20}>
          <Text
            textAlign={"center"}
            color={AppColors.SECONDARY}
            fontSize={22}
            fontWeight={"semibold"}
          >
            Your Service has{"\n"}been Booked!
          </Text>
          <Center>
            <SvgCss xml={BOOKING_SUCCESS} />
          </Center>
        </VStack>
      </ScrollView>
      <FooterButton
        label="Home"
        subText="Provide payment information in next step"
        onPress={() => popToPop("Dashboard")}
      />
    </AppSafeAreaView>
  );
};

export default Booked;
