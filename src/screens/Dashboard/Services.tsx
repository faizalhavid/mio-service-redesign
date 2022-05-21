import React from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import UpcomingPast from "../../components/UpcomingPast";
import { navigate } from "../../navigations/rootNavigation";

const Services = (): JSX.Element => {
  return (
    <AppSafeAreaView mt={0} bg={AppColors.EEE}>
      <UpcomingPast />
      <FloatingButton />
    </AppSafeAreaView>
  );
};

export default Services;
