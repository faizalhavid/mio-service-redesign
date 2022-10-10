import { HStack, VStack, Pressable, Text } from "native-base";
import React, { useState } from "react";
import { AppColors } from "../../commons/colors";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import ServiceHistory from "../../screens/Home/ServiceHistory";
import UpcomingServices from "../../screens/Home/UpcomingServices";
import {
  selectRefreshNeeded,
  setRefreshNeeded,
} from "../../slices/shared-slice";

type CurrentScreenType = "UPCOMING" | "PAST";
function UpcomingPast(): JSX.Element {
  const dispatch = useAppDispatch();
  const [currentScreen, setCurrentScreen] =
    useState<CurrentScreenType>("UPCOMING");
  const [reload, setReload] = useState("NO");
  const { member: refreshNeeded } = useAppSelector(selectRefreshNeeded);
  React.useEffect(() => {
    if (
      refreshNeeded.UPCOMING_SERVICES &&
      refreshNeeded.UPCOMING_SERVICES === true
    ) {
      setReload(`YES_${new Date().getTime()}`);
      dispatch(setRefreshNeeded({ data: { UPCOMING_SERVICES: false } }));
    }
  }, [refreshNeeded]);

  function ChooserCardButton({
    selected,
    text,
    screen,
  }: {
    selected: boolean;
    text: string;
    screen: CurrentScreenType;
  }): JSX.Element {
    return (
      <Pressable
        borderLeftRadius={screen === "UPCOMING" ? 5 : 0}
        borderRightRadius={screen === "PAST" ? 5 : 0}
        width="50%"
        py={2}
        borderWidth={1}
        borderColor={AppColors.TEAL}
        bg={selected ? AppColors.TEAL : "transparent"}
        onPress={() => {
          setCurrentScreen(screen);
        }}
      >
        <Text
          alignSelf="center"
          fontSize={12}
          fontWeight="semibold"
          color={selected ? "white" : AppColors.SECONDARY}
        >
          {text}
        </Text>
      </Pressable>
    );
  }

  function ChooserCard(): JSX.Element {
    return (
      <HStack
        justifyContent="space-evenly"
        alignItems="center"
        mx={3}
        my={3}
        borderRadius={10}
      >
        <ChooserCardButton
          selected={currentScreen === "UPCOMING"}
          text="UPCOMING SERVICES"
          screen="UPCOMING"
        />
        <ChooserCardButton
          selected={currentScreen === "PAST"}
          text="PAST SERVICES"
          screen="PAST"
        />
      </HStack>
    );
  }
  return (
    <VStack pb={100}>
      <ChooserCard />
      {currentScreen === "UPCOMING" && <UpcomingServices key={reload} />}
      {currentScreen === "PAST" && <ServiceHistory />}
      {/* <Divider mt={"200px"} thickness={0} /> */}
    </VStack>
  );
}

export default UpcomingPast;
