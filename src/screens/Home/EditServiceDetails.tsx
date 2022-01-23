import { VStack, Text, HStack, Divider, Button, TextArea } from "native-base";
import React from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SvgCss } from "react-native-svg";
import { LAWN_CARE } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import ServiceDetailsOptions from "../../components/ServiceDetailsOptions";
import { goBack, navigate } from "../../navigations/rootNavigation";

type EditServiceDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EditServiceDetails = ({
  isOpen,
  onClose,
}: EditServiceDetailsProps): JSX.Element => {
  const LAWN_CARE_INFO = <ServiceDetailsOptions title="HOW BIG IS YOUR LOT?" />;
  const POOL_LEANING_INFO = (
    <ServiceDetailsOptions title="WHAT TYPE OF POOL DO YOU HAVE?" />
  );
  const HOUSE_CLEANING_INFO = (
    <>
      <ServiceDetailsOptions title="HOW MANY STORIES IN YOUR HOME?" />
      <Divider thickness={0} mt={3} />
      <ServiceDetailsOptions title="HOW MANY BEDROOMS?" />
      <Divider thickness={0} mt={3} />
      <ServiceDetailsOptions title="HOW MANY BATHROOMS?" />
    </>
  );
  const PES_CONTROL_INFO = (
    <ServiceDetailsOptions title="WHAT TYPE OF PESTS ARE YOU DEALING WITH?" />
  );

  return (
    <AppSafeAreaView p={0}>
      <VStack p={5}>
        <ScrollView>
          <Divider thickness={0} mt={20}></Divider>
          <HStack justifyContent={"space-between"} alignItems={"center"}>
            <Text
              fontSize={20}
              fontWeight={"semibold"}
              color={AppColors.DARK_PRIMARY}
            >
              Lawn Care
            </Text>
            <SvgCss
              xml={LAWN_CARE(AppColors.DARK_PRIMARY)}
              width={25}
              height={25}
            />
          </HStack>
          <Divider thickness={1} my={4}></Divider>

          <VStack>
            <HStack>
              <Text
                fontSize={14}
                fontWeight={"semibold"}
                width={"100%"}
                color={AppColors.SECONDARY}
              >
                Choose Lot Size
              </Text>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <HStack space={2}>
              <Button
                width={38}
                height={38}
                bg={AppColors.SECONDARY}
                borderColor={AppColors.SECONDARY}
              >
                <Text color={"white"}>1</Text>
              </Button>
              <Button
                variant={"outline"}
                width={38}
                height={38}
                borderColor={AppColors.SECONDARY}
              >
                <Text color={AppColors.SECONDARY}>2</Text>
              </Button>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <HStack>
              <Text
                fontSize={14}
                fontWeight={"semibold"}
                width={"100%"}
                color={AppColors.SECONDARY}
              >
                Choose Subscription Method
              </Text>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <HStack space={2}>
              <Button
                width={120}
                height={100}
                bg={AppColors.SECONDARY}
                borderColor={AppColors.SECONDARY}
              >
                <VStack>
                  <HStack
                    space={2}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Text fontSize={30} color={"white"}>
                      $40
                    </Text>
                    <Text fontSize={12} color={"white"}>
                      /Weekly
                    </Text>
                  </HStack>
                  <Text textAlign={"center"} fontSize={10} color={"white"}>
                    $160 Billed Monthly
                  </Text>
                </VStack>
              </Button>
              <Button
                width={120}
                height={100}
                variant={"outline"}
                borderColor={AppColors.SECONDARY}
              >
                <VStack justifyContent={"center"} alignItems={"center"}>
                  <Text fontSize={30} color={AppColors.SECONDARY}>
                    $55
                  </Text>
                  <Text
                    textAlign={"center"}
                    fontSize={10}
                    color={AppColors.SECONDARY}
                  >
                    One-time Service
                  </Text>
                </VStack>
              </Button>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <HStack>
              <Text
                fontSize={14}
                fontWeight={"semibold"}
                width={"100%"}
                color={AppColors.SECONDARY}
              >
                Choose Frequency
              </Text>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <HStack space={2}>
              <Button
                bg={AppColors.SECONDARY}
                borderColor={AppColors.SECONDARY}
              >
                <Text color={"white"}>Weekly</Text>
              </Button>
              <Button variant={"outline"} borderColor={AppColors.SECONDARY}>
                <Text color={AppColors.SECONDARY}>Bi-weekly</Text>
              </Button>
              <Button variant={"outline"} borderColor={AppColors.SECONDARY}>
                <Text color={AppColors.SECONDARY}>Monthly</Text>
              </Button>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <HStack>
              <Text
                fontSize={14}
                fontWeight={"semibold"}
                width={"100%"}
                color={AppColors.SECONDARY}
              >
                Choose Date
              </Text>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <HStack space={2}>
              <Button
                width={75}
                height={75}
                bg={AppColors.SECONDARY}
                borderColor={AppColors.SECONDARY}
              >
                <VStack justifyContent={"center"} alignItems={"center"}>
                  <Text color={"white"}>Mon</Text>
                  <Text color={"white"}>Aug 2</Text>
                </VStack>
              </Button>
              <Button
                width={75}
                height={75}
                variant={"outline"}
                borderColor={AppColors.SECONDARY}
              >
                <VStack justifyContent={"center"} alignItems={"center"}>
                  <Text color={AppColors.SECONDARY}>Web</Text>
                  <Text color={AppColors.SECONDARY}>Aug 3</Text>
                </VStack>
              </Button>
              <Button
                width={75}
                height={75}
                variant={"outline"}
                borderColor={AppColors.SECONDARY}
              >
                <VStack justifyContent={"center"} alignItems={"center"}>
                  <Text color={AppColors.SECONDARY}>Thurs</Text>
                  <Text color={AppColors.SECONDARY}>Aug 4</Text>
                </VStack>
              </Button>
              <Button
                width={75}
                height={75}
                variant={"outline"}
                borderColor={AppColors.SECONDARY}
              >
                <VStack justifyContent={"center"} alignItems={"center"}>
                  <Text color={AppColors.SECONDARY}>Tue</Text>
                  <Text color={AppColors.SECONDARY}>Aug 5</Text>
                </VStack>
              </Button>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <HStack>
              <Text
                fontSize={14}
                fontWeight={"semibold"}
                width={"100%"}
                color={AppColors.SECONDARY}
              >
                Choose Timeslot
              </Text>
            </HStack>
            <Divider thickness={0} mt={4}></Divider>
            <VStack space={2}>
              <HStack space={2}>
                <Button
                  width={120}
                  bg={AppColors.SECONDARY}
                  borderColor={AppColors.SECONDARY}
                >
                  <Text color={"white"}>8 AM - 10 AM</Text>
                </Button>
                <Button
                  width={120}
                  variant={"outline"}
                  borderColor={AppColors.SECONDARY}
                >
                  <Text color={AppColors.SECONDARY}>10 AM - 2 PM</Text>
                </Button>
              </HStack>
              <HStack space={2}>
                <Button
                  width={120}
                  variant={"outline"}
                  borderColor={AppColors.SECONDARY}
                >
                  <Text color={AppColors.SECONDARY}>2 PM - 6 PM</Text>
                </Button>
                <Button
                  width={120}
                  variant={"outline"}
                  borderColor={AppColors.SECONDARY}
                >
                  <Text color={AppColors.SECONDARY}>6 PM - 8 PM</Text>
                </Button>
              </HStack>
              <Divider thickness={0} mt={4}></Divider>
              <Text
                fontSize={14}
                fontWeight={"semibold"}
                width={"100%"}
                color={AppColors.SECONDARY}
              >
                Add Service Note
              </Text>
              <Divider thickness={0} mt={1}></Divider>
              <KeyboardAwareScrollView>
                <TextArea numberOfLines={5} mb={50}></TextArea>
              </KeyboardAwareScrollView>
              <Divider thickness={0} mt={250}></Divider>
            </VStack>
          </VStack>
        </ScrollView>
      </VStack>
      <FooterButton label="SAVE" onPress={() => goBack()} />
    </AppSafeAreaView>
  );
};

export default EditServiceDetails;
