import {
  Center,
  Divider,
  Fab,
  HStack,
  Icon,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { ImageBackground } from "react-native";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FloatingButton from "../../components/FloatingButton";
import ServiceCard from "../../components/ServiceCard";
import { navigate } from "../../navigations/rootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = (): JSX.Element => {
  AsyncStorage.setItem("verified", "true");
  return (
    <AppSafeAreaView mt={0}>
      <ScrollView>
        <VStack pb={150}>
          <ImageBackground
            resizeMode="cover"
            style={{
              padding: 10,
            }}
            source={require("../../assets/images/dashboard-bg.png")}
          >
            <VStack>
              <Center pt={10}>
                <Text fontWeight={"semibold"} fontSize={16}>
                  Welcome Back Haylie
                </Text>
                <Text mt={2} textAlign={"center"}>
                  Get ready for a beautiful lawn! {"\n"} Your next service is
                  scheduled for
                </Text>
              </Center>
              <ServiceCard
                variant="solid"
                showAddToCalendar={true}
                showReschedule={true}
                showChat={true}
              />
              <Divider my={5} thickness={1} />
              <Text fontSize={18} pl={2} fontWeight={"semibold"}>
                Upcoming Services
              </Text>
              <ScrollView width={400} horizontal={true}>
                <HStack mr={20} space={3}>
                  <ServiceCard variant="outline" showAddToCalendar={true} />
                  <ServiceCard variant="outline" showAddToCalendar={true} />
                  <ServiceCard variant="outline" showAddToCalendar={true} />
                </HStack>
              </ScrollView>
              <Divider my={5} thickness={1} />
              <Text fontSize={18} pl={2} fontWeight={"semibold"}>
                Past Services
              </Text>
              <ScrollView width={400} horizontal={true}>
                <HStack mr={20} space={3}>
                  <ServiceCard variant="outline" />
                  <ServiceCard variant="outline" />
                  <ServiceCard variant="outline" />
                </HStack>
              </ScrollView>
            </VStack>
          </ImageBackground>
        </VStack>
      </ScrollView>
      <FloatingButton onPress={() => navigate("ChooseService")} />
    </AppSafeAreaView>
  );
};

export default Home;
