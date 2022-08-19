import React from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import UpcomingPast from "../../components/UpcomingPast";
import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../navigations/rootNavigation";

const Services = (): JSX.Element => {
  const { isViewer } = useAuth();
  return (
    <AppSafeAreaView bg={AppColors.EEE}>
      <UpcomingPast />
      {!isViewer && <FloatingButton />}
    </AppSafeAreaView>
  );
};

export default Services;
