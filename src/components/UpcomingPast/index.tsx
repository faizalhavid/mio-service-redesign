import { HStack, VStack, Pressable, Text } from "native-base";
import React, { useState } from "react";
import { AppColors } from "../../commons/colors";
import ServiceHistory from "../../screens/Home/ServiceHistory";
import UpcomingServices from "../../screens/Home/UpcomingServices";

type CurrentScreenType = "UPCOMING" | "PAST";
const UpcomingPast = (): JSX.Element => {
  const [currentScreen, setCurrentScreen] =
    useState<CurrentScreenType>("UPCOMING");

  const ChooserCardButton = ({
    selected,
    text,
    screen,
  }: {
    selected: boolean;
    text: string;
    screen: CurrentScreenType;
  }): JSX.Element => {
    return (
      <Pressable
        borderLeftRadius={screen === "UPCOMING" ? 5 : 0}
        borderRightRadius={screen === "PAST" ? 5 : 0}
        width={"50%"}
        py={2}
        borderWidth={1}
        borderColor={AppColors.TEAL}
        bg={selected ? AppColors.TEAL : "transparent"}
        onPress={() => {
          setCurrentScreen(screen);
        }}
      >
        <Text
          alignSelf={"center"}
          fontSize={12}
          fontWeight={"semibold"}
          color={selected ? "white" : AppColors.SECONDARY}
        >
          {text}
        </Text>
      </Pressable>
    );
  };

  const ChooserCard = (): JSX.Element => {
    return (
      <HStack
        justifyContent={"space-evenly"}
        alignItems="center"
        mx={3}
        my={3}
        borderRadius={10}
      >
        <ChooserCardButton
          selected={currentScreen === "UPCOMING"}
          text={"UPCOMING SERVICES"}
          screen="UPCOMING"
        />
        <ChooserCardButton
          selected={currentScreen === "PAST"}
          text={"PAST SERVICES"}
          screen="PAST"
        />
      </HStack>
    );
  };
  return (
    <VStack>
      <ChooserCard />
      {currentScreen === "UPCOMING" && <UpcomingServices />}
      {currentScreen === "PAST" && <ServiceHistory />}
    </VStack>
  );
};

export default UpcomingPast;
