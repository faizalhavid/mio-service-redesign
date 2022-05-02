import {
  FlatList,
  HStack,
  Pressable,
  Text,
  TextArea,
  VStack,
} from "native-base";
import React from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import VirtualizedView from "../../components/VirtualizedView";
import { goBack } from "../../navigations/rootNavigation";

const ChooseDateTime = (): JSX.Element => {
  const columns = 2;
  return (
    <AppSafeAreaView loading={false}>
      <VirtualizedView>
        <KeyboardAwareScrollView enableOnAndroid={true}>
          <VStack mt={0} space={5}>
            <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
              Choose Date
            </Text>
            <HStack
              justifyContent={"center"}
              alignItems={"center"}
              space={0}
              bg={"#eee"}
              p={3}
            >
              <FlatList
                data={[
                  { day: "Wed", date: "Apr 25" },
                  { day: "Thu", date: "Apr 26" },
                  { day: "Fri", date: "Apr 27" },
                  { day: "Sat", date: "Apr 28" },
                ]}
                horizontal={true}
                contentContainerStyle={{
                  width: "100%",
                }}
                renderItem={({ index, item }) => (
                  <Pressable
                    key={index}
                    height={20}
                    borderRadius={5}
                    width={78}
                    mr={2}
                    p={2}
                    justifyContent="center"
                    alignItems={"center"}
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
                      textAlign="center"
                    >
                      {item.day} {"\n"} {item.date}
                    </Text>
                  </Pressable>
                )}
              />
            </HStack>
            <Text textAlign={"center"} fontWeight={"semibold"} fontSize={18}>
              Choose Slot
            </Text>
            <HStack
              justifyContent={"center"}
              alignItems={"center"}
              space={0}
              bg={"#eee"}
              p={3}
            >
              <FlatList
                data={[
                  "8 AM - 12 PM",
                  "10 AM - 2 PM",
                  "12 PM - 4 PM",
                  "2 PM - 6 PM",
                ]}
                numColumns={columns}
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
              Service Notes{" "}
              <Text color={AppColors.AAA} fontSize={14}>
                (Optional)
              </Text>
            </Text>
            <TextArea
              mx={3}
              onChangeText={(text) => {
                // setServiceNotes(text);
              }}
              fontSize={14}
              //   value={serviceNotes}
              keyboardType="default"
              numberOfLines={5}
              mb={100}
              onFocus={() => {}}
            />
          </VStack>
        </KeyboardAwareScrollView>
      </VirtualizedView>
      <FooterButton
        type="DATETIME_SELECTION"
        label="DONE"
        disabled={false}
        onPress={async () => {
          //   chooseService();
          goBack();
        }}
      />
    </AppSafeAreaView>
  );
};

export default ChooseDateTime;
