import { VStack, Pressable, Text, HStack, Divider, Stack } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { AppColors } from "../../commons/colors";
import { useAppSelector } from "../../hooks/useAppSelector";
import { navigate } from "../../navigations/rootNavigation";
import { SERVICES } from "../../screens/Home/ChooseService";
import { selectLead } from "../../slices/lead-slice";

type OrderSummaryProps = {};

const OrderSummary = ({}: OrderSummaryProps): JSX.Element => {
  const { member: leadDetails } = useAppSelector(selectLead);

  return (
    <>
      {leadDetails?.subOrders.length > 0 && (
        <Stack
          position={"absolute"}
          bg={"#fff"}
          bottom={75}
          height={82}
          width={"100%"}
          p={1}
        >
          <Pressable
            borderColor={AppColors.SECONDARY}
            borderRadius={8}
            p={2}
            borderWidth={1.5}
            alignSelf={"center"}
            width={"99%"}
            _pressed={{
              backgroundColor: "teal.100",
            }}
            onPress={() => {
              navigate("ServiceDetails");
            }}
          >
            <VStack>
              <HStack justifyContent={"space-between"}>
                <Text color={AppColors.SECONDARY} px={2}>
                  Order Summary
                </Text>
                <Text color={AppColors.SECONDARY} px={2}>
                  $ -
                </Text>
              </HStack>
              <HStack
                space={3}
                px={2}
                mt={2}
                divider={<Divider thickness={1} p={0} m={0} />}
              >
                {/* {selectedServices.map((service, index) => (
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
                ))} */}
              </HStack>
            </VStack>
          </Pressable>
        </Stack>
      )}
    </>
  );
};

export default OrderSummary;
