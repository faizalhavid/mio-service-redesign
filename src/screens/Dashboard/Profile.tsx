import {
  Button,
  Center,
  ChevronRightIcon,
  Circle,
  Divider,
  HStack,
  Image,
  Pressable,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import Svg, { SvgCss } from "react-native-svg";
import {
  BOX_ARROW_RIGHT_ICON,
  CAMERA_ICON,
  CHEVRON_RIGHT_ICON,
  CREDIT_CARD_ICON,
  PERSONAL_DETAILS_ICON,
  PROFILE_ICON,
} from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import { navigate } from "../../navigations/rootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../contexts/AuthContext";

const Profile = (): JSX.Element => {
  const { logout } = useAuth();
  const [loading, setLoading] = React.useState(false);
  return (
    <AppSafeAreaView loading={loading}>
      <VStack>
        <Center>
          <Circle
            size={120}
            bg={AppColors.PRIMARY}
            children={
              <Image
                source={{ uri: "https://reactjs.org/logo-og.png" }}
                width={120}
                height={120}
                alt="Profile"
                borderRadius={200}
              />
            }
          ></Circle>
          <Circle
            marginTop={-10}
            marginLeft={20}
            size={5}
            bg={AppColors.SECONDARY}
            p={5}
          >
            <SvgCss xml={CAMERA_ICON} />
          </Circle>
        </Center>
        <VStack mt={10}>
          <Divider thickness={1} borderColor={AppColors.SECONDARY} />
          <Pressable
            _pressed={{
              backgroundColor: "#eee",
            }}
            onPress={() => navigate("PersonalDetails")}
          >
            <HStack justifyContent={"space-between"} alignItems={"center"}>
              <HStack px={5} space={3} alignItems={"center"}>
                <SvgCss
                  xml={PERSONAL_DETAILS_ICON("#000")}
                  width={20}
                  height={20}
                />
                <Text py={5} fontWeight={"semibold"}>
                  Personal Details
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
            onPress={() => navigate("PaymentMethods")}
          >
            <HStack justifyContent={"space-between"} alignItems={"center"}>
              <HStack px={5} space={3} alignItems={"center"}>
                <SvgCss xml={CREDIT_CARD_ICON("#000")} width={20} height={20} />
                <Text py={5} fontWeight={"semibold"}>
                  Payment Methods
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
            onPress={async () => {
              setLoading(true);
              await logout();
              // setLoading(false);
              navigate("Welcome");
            }}
          >
            <HStack justifyContent={"space-between"} alignItems={"center"}>
              <HStack px={5} space={3} alignItems={"center"}>
                <SvgCss
                  xml={BOX_ARROW_RIGHT_ICON("#900C3F")}
                  width={20}
                  height={20}
                />
                <Text py={5} fontWeight={"semibold"} color={"#900C3F"}>
                  Logout
                </Text>
              </HStack>
            </HStack>
          </Pressable>
          <Divider thickness={1} borderColor={AppColors.SECONDARY} />
        </VStack>
      </VStack>
      <FloatingButton onPress={() => navigate("ChooseService")} />
    </AppSafeAreaView>
  );
};

export default Profile;
