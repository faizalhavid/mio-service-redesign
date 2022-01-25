import { Button, Center, ScrollView, Text, VStack } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { BOOKING_SUCCESS } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { navigate, popToPop } from "../../navigations/rootNavigation";

const Booked = (): JSX.Element => {
  return (
    <AppSafeAreaView p={0}>
      <ScrollView mt={120}>
        <VStack space={5}>
          <Text textAlign={"center"} fontSize={22} fontWeight={"semibold"}>
            Your Service has {"\n"}Been Booked!
          </Text>
          <Center>
            <SvgCss xml={BOOKING_SUCCESS} />
          </Center>
          <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
            Email Verification Link Sent!
          </Text>
          <Text textAlign={"center"} fontSize={14}>
            Please click the link in your email to {"\n"}
            complete your sign up.
          </Text>
          <Button
            variant={"outline"}
            width={"50%"}
            alignSelf={"center"}
            borderColor={AppColors.SECONDARY}
            borderRadius={10}
            borderWidth={1}
            size={"sm"}
          >
            <Text color={AppColors.SECONDARY} fontWeight={"semibold"}>
              Send Email Again
            </Text>
          </Button>
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
