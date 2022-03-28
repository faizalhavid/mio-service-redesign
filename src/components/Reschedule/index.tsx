import { Actionsheet, Text, useDisclose, View } from "native-base";
import React from "react";
import { Linking, Platform } from "react-native";
import { AppColors } from "../../commons/colors";

type RescheduleProps = {
  isOpen: boolean;
  setOpen: Function;
  orderId: string;
  serviceName: string;
};

export const Reschedule = ({
  isOpen,
  setOpen,
  orderId,
  serviceName,
}: RescheduleProps): JSX.Element => {
  return (
    <>
      <Actionsheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Actionsheet.Content>
          <View py={10} px={1}>
            <Text fontSize={20} lineHeight={35}>
              To Reschedule, Please contact us at{" "}
              <Text
                color={AppColors.TEAL}
                onPress={() => {
                  Linking.openURL(
                    `${
                      Platform.OS === "ios" ? "telprompt" : "tel"
                    }:${18669607414}`
                  );
                }}
                fontWeight={"semibold"}
              >
                +1 (866) 960-7414
              </Text>{" "}
              or mail us at{" "}
              <Text
                fontWeight={"semibold"}
                color={AppColors.TEAL}
                onPress={() => {
                  Linking.openURL(
                    `mailto:support@miohomeservices.com?subject=[${orderId}] Reschedule&body=Hi, \n\n Order ID: ${orderId} \n Service Name: ${serviceName} \n\n Reschedule at: \n`
                  );
                }}
              >
                support@miohomeservices.com
              </Text>
            </Text>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};
