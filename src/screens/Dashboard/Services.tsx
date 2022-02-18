import {
  Center,
  Divider,
  HStack,
  Pressable,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { ImageBackground, ScrollView } from "react-native";
import { SvgCss } from "react-native-svg";
import {
  PERSONAL_DETAILS_ICON,
  CHEVRON_RIGHT_ICON,
  CREDIT_CARD_ICON,
  ARCHIVE_ICON,
  UPCOMING_SERVICES_ICON,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import { navigate } from "../../navigations/rootNavigation";

const Services = (): JSX.Element => {
  return (
    <AppSafeAreaView mt={0}>
      <VStack pb={150}>
        <ImageBackground
          resizeMode="cover"
          style={{
            padding: 10,
          }}
          source={require("../../assets/images/dashboard-bg.png")}
        >
          <Center pt={20}>
            <Text fontSize={20}>Services</Text>
          </Center>
          <Divider thickness={1} mt={10} borderColor={AppColors.SECONDARY} />
          <Pressable
            _pressed={{
              backgroundColor: "#eee",
            }}
            onPress={() => navigate("UpcomingServices")}
          >
            <HStack justifyContent={"space-between"} alignItems={"center"}>
              <HStack px={5} space={3} alignItems={"center"}>
                <SvgCss
                  xml={UPCOMING_SERVICES_ICON("#000")}
                  width={18}
                  height={18}
                />
                <Text py={5} fontWeight={"semibold"}>
                  Upcoming Services
                </Text>
              </HStack>
              <View pr={5}>
                <SvgCss
                  xml={CHEVRON_RIGHT_ICON("#aaa")}
                  width={20}
                  height={20}
                />
              </View>
            </HStack>
          </Pressable>
          <Divider thickness={1} borderColor={AppColors.SECONDARY} />
          <Pressable
            _pressed={{
              backgroundColor: "#eee",
            }}
            onPress={() => navigate("ServiceHistory")}
          >
            <HStack justifyContent={"space-between"} alignItems={"center"}>
              <HStack px={5} space={3} alignItems={"center"}>
                <SvgCss xml={ARCHIVE_ICON("#000")} width={18} height={18} />
                <Text py={5} fontWeight={"semibold"}>
                  Service History
                </Text>
              </HStack>
              <View pr={5}>
                <SvgCss
                  xml={CHEVRON_RIGHT_ICON("#aaa")}
                  width={20}
                  height={20}
                />
              </View>
            </HStack>
          </Pressable>
          <Divider thickness={1} borderColor={AppColors.SECONDARY} />
        </ImageBackground>
      </VStack>
      <FloatingButton onPress={() => navigate("ChooseService")} />
    </AppSafeAreaView>
  );
};

export default Services;
