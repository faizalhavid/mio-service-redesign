import {
  FlatList,
  HStack,
  Pressable,
  ScrollView,
  Spacer,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { goBack, navigate } from "../../navigations/rootNavigation";
import {
  selectSelectedServices,
  updateSelectedServices,
} from "../../slices/service-slice";

const ChoosePlan = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const { member: selectedService } = useAppSelector(selectSelectedServices);

  const frequencyColumns = 2;

  const chooseService = () => {
    dispatch(updateSelectedServices({ selectedService: selectedService }));
    goBack();
  };

  return (
    <AppSafeAreaView>
      {/* <ScrollView> */}
      <VStack mt={0} space={5}>
        <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
          Choose Frequency
        </Text>
        <HStack
          justifyContent={"center"}
          alignItems={"center"}
          space={0}
          bg={"#eee"}
          p={3}
        >
          <FlatList
            data={["Weekly", "Bi-Weekly", "Monthly", "One-Time"]}
            numColumns={frequencyColumns}
            contentContainerStyle={{
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
            renderItem={({ index, item }) => (
              <Pressable
                key={index}
                height={10}
                borderRadius={5}
                width={"48%"}
                m={1}
                justifyContent="center"
                p={2}
                onPress={() => {}}
                borderWidth={index == 2 ? 1 : 0}
                borderColor={AppColors.TEAL}
                bg={index == 2 ? AppColors.LIGHT_TEAL : "#fff"}
                _pressed={{
                  borderColor: AppColors.TEAL,
                  borderWidth: 1,
                  backgroundColor: AppColors.LIGHT_TEAL,
                }}
              >
                <Text
                  alignSelf={"center"}
                  color={AppColors.TEAL}
                  fontWeight={"semibold"}
                >
                  {item}
                </Text>
              </Pressable>
            )}
          />
        </HStack>
        <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
          Choose Plan
        </Text>
        <HStack
          justifyContent={"center"}
          alignItems={"center"}
          space={0}
          bg={"#eee"}
          p={3}
          pb={200}
        >
          <FlatList
            data={["BASIC", "STANDARD", "PREMIUM"]}
            contentContainerStyle={{
              width: "100%",
              paddingBottom: 500,
            }}
            renderItem={({ index, item }) => (
              <Pressable
                alignSelf={"center"}
                key={index}
                borderColor={AppColors.TEAL}
                bg={index == 1 ? AppColors.LIGHT_TEAL : "#fff"}
                borderWidth={index == 1 ? 1 : 0}
                minHeight={100}
                borderRadius={6}
                width={"100%"}
                m={1}
                p={3}
                onPress={() => {}}
                _pressed={{
                  borderColor: AppColors.TEAL,
                  borderWidth: 1,
                  backgroundColor: AppColors.LIGHT_TEAL,
                }}
              >
                <HStack justifyContent={"space-between"}>
                  <VStack>
                    <Text
                      color={AppColors.TEAL}
                      fontSize={18}
                      fontWeight={"semibold"}
                    >
                      {item}
                    </Text>
                    <Spacer
                      borderWidth={0.5}
                      my={1}
                      borderColor="#eee"
                      borderRadius={5}
                    />
                    <Text
                      color={AppColors.DARK_PRIMARY}
                      fontSize={14}
                      fontWeight={"semibold"}
                    >
                      Benefits
                    </Text>
                    {[1, 2, 3].map((b, i) => (
                      <Text
                        key={i}
                        color={AppColors.DARK_PRIMARY}
                        fontSize={12}
                      >
                        {b}. This is the benefit one
                      </Text>
                    ))}
                  </VStack>
                  <VStack
                    alignItems={"center"}
                    alignContent="center"
                    justifyContent={"flex-start"}
                    pr={5}
                  >
                    <Text
                      color={AppColors.DARK_PRIMARY}
                      fontSize={24}
                      fontWeight={"semibold"}
                    >
                      $10
                    </Text>
                    <Text color={"#bbb"} fontSize={12} fontWeight={"semibold"}>
                      MONTLY
                    </Text>
                  </VStack>
                </HStack>
              </Pressable>
            )}
          />
        </HStack>
      </VStack>
      <FooterButton
        type="PLAN_SELECTION"
        label="DONE"
        disabled={false}
        subText="Please add required services"
        onPress={async () => {
          chooseService();
        }}
      />
      {/* </ScrollView> */}
    </AppSafeAreaView>
  );
};

export default ChoosePlan;
