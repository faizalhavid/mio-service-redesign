import { Fab, Icon, Text } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { HOME_ICON } from "../../commons/assets";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import { navigate } from "../../navigations/rootNavigation";

const Home = (): JSX.Element => {
  return (
    <AppSafeAreaView>
      <Text>Home</Text>
      <FloatingButton onPress={() => navigate("ChooseService")} />
    </AppSafeAreaView>
  );
};

export default Home;
