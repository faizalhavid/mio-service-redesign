import {
  Center,
  Divider,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import {
  INFO_ICON,
  CIRCLE_TICK_ICON,
  CALENDAR_ICON,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";

const ViewServiceDetails = (): JSX.Element => {
  return (
    <AppSafeAreaView>
      <ScrollView>
        <VStack>
          <Center mb={2}>
            <Text fontSize={20}>Service Details</Text>
          </Center>
          <Divider thickness={0} mt={5} />
          <Center bg={AppColors.PRIMARY} shadow={2} px={6} py={2}>
            <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
              Overview
            </Text>
          </Center>
          <Center>
            <Divider thickness={0} mt={5} />
            <Text fontSize={16} fontWeight={"semibold"}>
              Basic Lawn Service
            </Text>
            <Text fontSize={14}>May 2, 10 AM - 12 PM</Text>
            <Divider thickness={0} mt={5} />
            <Text fontSize={16} fontWeight={"semibold"}>
              12115 West Airport Blvd,
            </Text>
            <Text fontSize={14}>Sugar Land, Texas 77404</Text>
          </Center>
          <Divider thickness={0} mt={5} />
          <Center bg={AppColors.PRIMARY} shadow={2} px={6} py={2}>
            <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
              Service Provider
            </Text>
          </Center>
          <Center>
            <Divider thickness={0} mt={5} />
            <Text fontSize={16} fontWeight={"semibold"}>
              Jaylon Calzoni
            </Text>
            <Text fontSize={14}>Jay's Green Lawns</Text>
            <Divider thickness={0} mt={5} />
            <Text fontSize={14}>12115 West Airport Blvd,</Text>
            <Text fontSize={14}>Sugar Land, Texas 77404</Text>
            <Text fontSize={14}>000-000-0000</Text>
            <Text fontSize={14}>name@email.com</Text>
          </Center>
          <Divider thickness={0} mt={5} />
          <Center bg={AppColors.PRIMARY} shadow={2} px={6} py={2}>
            <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
              Service Frequency
            </Text>
          </Center>
          <Divider thickness={0} mt={5} />
          <HStack space={2} alignItems={"center"} pl={3}>
            <SvgCss xml={INFO_ICON} width={20} height={20} />
            <Text color={AppColors.SECONDARY} fontSize={14}>
              Lot Size
            </Text>
          </HStack>
          <HStack space={2} alignItems={"center"} pl={3}>
            <SvgCss xml={CIRCLE_TICK_ICON} width={20} height={20} />
            <Text color={AppColors.SECONDARY} fontSize={14}>
              $40 weekly service
            </Text>
          </HStack>
          <HStack space={2} alignItems={"center"} pl={3}>
            <SvgCss xml={CALENDAR_ICON} width={20} height={20} />
            <Text color={AppColors.SECONDARY} fontSize={14}>
              Monday, Aug 2, 8:00 AM - 10 AM
            </Text>
          </HStack>
          <Divider thickness={0} mt={150} />
        </VStack>
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default ViewServiceDetails;
