import { HStack, Text, View, VStack } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import { navigate } from "../../navigations/rootNavigation";

const Services = (): JSX.Element => {
  const ChooserCard = (): JSX.Element => {
    return (
      <HStack
        justifyContent={"space-evenly"}
        alignItems="center"
        mx={3}
        my={3}
        borderRadius={10}
      >
        <View
          borderLeftRadius={5}
          width={"50%"}
          bg={AppColors.TEAL}
          borderWidth={1}
          borderColor={AppColors.TEAL}
          py={2}
        >
          <Text
            alignSelf={"center"}
            fontSize={12}
            fontWeight={"semibold"}
            color="white"
          >
            UPCOMING SERVICES
          </Text>
        </View>
        <View
          borderRightRadius={5}
          width={"50%"}
          py={2}
          borderWidth={1}
          borderColor={AppColors.TEAL}
        >
          <Text
            alignSelf={"center"}
            fontSize={12}
            fontWeight={"semibold"}
            // color="white"
          >
            PAST SERVICES
          </Text>
        </View>
      </HStack>
    );
  };

  const ServiceCard = (): JSX.Element => {
    return (
      <VStack>
        <Text px={3} fontSize={16} my={2} fontWeight={"semibold"}>
          January 2022
        </Text>
        <HStack
          bg={"white"}
          borderWidth={1}
          borderColor="white"
          mx={3}
          p={3}
          borderTopRadius={10}
        >
          <VStack
            alignItems={"center"}
            borderRadius={10}
            bg={AppColors.LIGHT_TEAL}
            px={5}
            py={2}
          >
            <Text fontSize={12} fontWeight={"semibold"}>
              FRI
            </Text>
            <Text fontSize={16} fontWeight={"semibold"}>
              10
            </Text>
          </VStack>
          <VStack pl={3}>
            <Text fontSize={16} fontWeight={"semibold"}>
              Lawn Care Service
            </Text>
            <Text fontSize={14} fontWeight="semibold" color={AppColors.AAA}>
              10 AM - 2 PM
            </Text>
          </VStack>
        </HStack>
        <VStack
          borderTopWidth={1}
          borderTopColor={AppColors.EEE}
          borderBottomRadius={10}
          mx={3}
          p={3}
          bg={"white"}
        >
          <HStack justifyContent={"space-between"}>
            <Text fontSize={14} color={AppColors.TEAL} fontWeight={"semibold"}>
              Add to Calendar
            </Text>
            <Text fontSize={14} color={AppColors.TEAL} fontWeight={"semibold"}>
              Reschedule
            </Text>
          </HStack>
        </VStack>
      </VStack>
    );
  };

  return (
    <AppSafeAreaView mt={0} bg={AppColors.EEE}>
      <VStack pb={150} pt={3}>
        <ChooserCard />
        <VStack mt={2}>
          <ServiceCard />
        </VStack>
      </VStack>
      <FloatingButton onPress={() => navigate("ChooseService")} />
    </AppSafeAreaView>
  );
};

export default Services;
