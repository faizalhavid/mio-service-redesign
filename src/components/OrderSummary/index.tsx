import {
  VStack,
  Center,
  Pressable,
  Button,
  Text,
  useContrastText,
  Circle,
  HStack,
  Divider,
} from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { LAWN_CARE } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import { navigate } from "../../navigations/rootNavigation";
import { SERVICES, ServicesType } from "../../screens/Home/ChooseService";

type OrderSummaryProps = {
  selectedServices: string[];
};

const OrderSummary = ({ selectedServices }: OrderSummaryProps): JSX.Element => {
  return (
    <>
      {selectedServices.length > 0 && (
        <Pressable
          borderColor={AppColors.SECONDARY}
          borderRadius={8}
          p={2}
          borderWidth={1.5}
          alignSelf={"center"}
          position={"absolute"}
          bottom={79}
          height={85}
          width={"98%"}
          _pressed={{
            backgroundColor: "teal.100",
          }}
          onPress={() => {
            navigate("ServiceDetails", { mode: "PREVIEW" });
          }}
        >
          <VStack>
            <HStack justifyContent={"space-between"}>
              <Text color={AppColors.SECONDARY} px={2}>
                Order Summary
              </Text>
              {/* <Text px={2}>More</Text> */}
            </HStack>
            <HStack
              space={3}
              px={2}
              mt={2}
              divider={<Divider thickness={1} p={0} m={0} />}
            >
              {selectedServices.map((service, index) => (
                <HStack
                  key={index}
                  space={2}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <SvgCss
                    xml={SERVICES[service].icon(AppColors.SECONDARY)}
                    width={25}
                    height={25}
                  />
                  <Text color={AppColors.SECONDARY}>
                    {SERVICES[service].text.split(" ")[0]}
                  </Text>
                </HStack>
              ))}
            </HStack>
          </VStack>
        </Pressable>
      )}
    </>
  );
};

export default OrderSummary;
