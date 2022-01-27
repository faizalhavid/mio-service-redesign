import {
  VStack,
  Text,
  HStack,
  Divider,
  TextArea,
  PresenceTransition,
} from "native-base";
import React, { useEffect } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { SvgCss } from "react-native-svg";
import { LAWN_CARE } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import SelectionButton from "../../components/SelectionButton";
import { goBack } from "../../navigations/rootNavigation";

type EditServiceDetailsProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EditServiceDetails = ({
  isOpen,
  onClose,
}: EditServiceDetailsProps): JSX.Element => {
  // const LAWN_CARE_INFO = <ServiceDetailsOptions title="HOW BIG IS YOUR LOT?" />;
  // const POOL_LEANING_INFO = (
  //   <ServiceDetailsOptions title="WHAT TYPE OF POOL DO YOU HAVE?" />
  // );
  // const HOUSE_CLEANING_INFO = (
  //   <>
  //     <ServiceDetailsOptions title="HOW MANY STORIES IN YOUR HOME?" />
  //     <Divider thickness={0} mt={3} />
  //     <ServiceDetailsOptions title="HOW MANY BEDROOMS?" />
  //     <Divider thickness={0} mt={3} />
  //     <ServiceDetailsOptions title="HOW MANY BATHROOMS?" />
  //   </>
  // );
  // const PES_CONTROL_INFO = (
  //   <ServiceDetailsOptions title="WHAT TYPE OF PESTS ARE YOU DEALING WITH?" />
  // );

  const Title = (text: string) => {
    return (
      <Text
        fontSize={14}
        fontWeight={"semibold"}
        width={"100%"}
        color={AppColors.SECONDARY}
      >
        {text}
      </Text>
    );
  };

  const SectionDivider = (t: number) => {
    return <Divider thickness={t} mt={4}></Divider>;
  };

  const [showFields, setShowFields] = React.useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowFields(true);
    }, 0);
  }, []);

  return (
    <AppSafeAreaView>
      {showFields && (
        <PresenceTransition
          visible={true}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 150,
            },
          }}
        >
          <VStack p={5}>
            <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}>
              <ScrollView>
                <Divider thickness={0}></Divider>
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
                {SectionDivider(1)}
                {SectionDivider(0)}
                <VStack>
                  {Title("Choose Lot Size")}
                  {SectionDivider(0)}
                  <HStack space={2}>
                    <SelectionButton w={38} h={38} active={true} text="1" />
                    <SelectionButton w={38} h={38} active={false} text="2" />
                  </HStack>
                  {SectionDivider(0)}
                  {Title("Choose Subscription Method")}
                  {SectionDivider(0)}
                  <HStack space={2}>
                    <SelectionButton
                      w={120}
                      h={100}
                      variant="custom"
                      active={true}
                      text2={(color) => {
                        return (
                          <VStack
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <HStack
                              space={2}
                              justifyContent={"center"}
                              alignItems={"center"}
                            >
                              <Text fontSize={30} color={color}>
                                $40
                              </Text>
                              <Text fontSize={12} color={color}>
                                /Weekly
                              </Text>
                            </HStack>
                            <Text
                              textAlign={"center"}
                              fontSize={10}
                              color={color}
                            >
                              $160 Billed Monthly
                            </Text>
                          </VStack>
                        );
                      }}
                    />
                    <SelectionButton
                      w={120}
                      h={100}
                      variant="custom"
                      active={false}
                      text2={(color) => {
                        return (
                          <VStack
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Text fontSize={30} color={color}>
                              $55
                            </Text>
                            <Text
                              textAlign={"center"}
                              fontSize={10}
                              color={color}
                            >
                              One-time Service
                            </Text>
                          </VStack>
                        );
                      }}
                    />
                  </HStack>
                  {SectionDivider(0)}
                  {Title("Choose Frequency")}
                  {SectionDivider(0)}
                  <HStack space={2}>
                    <SelectionButton text={"Weekly"} active={true} />
                    <SelectionButton text={"Bi-weekly"} active={false} />
                    <SelectionButton text={"Monthly"} active={false} />
                  </HStack>
                  {SectionDivider(0)}
                  {Title("Choose Date")}
                  {SectionDivider(0)}
                  <HStack space={2}>
                    <SelectionButton
                      w={75}
                      h={75}
                      variant="custom"
                      active={true}
                      text2={(color) => {
                        return (
                          <VStack
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Text color={color}>Mon</Text>
                            <Text color={color}>Aug 2</Text>
                          </VStack>
                        );
                      }}
                    />
                    <SelectionButton
                      w={75}
                      h={75}
                      variant="custom"
                      active={false}
                      text2={(color) => {
                        return (
                          <VStack
                            justifyContent={"center"}
                            alignItems={"center"}
                          >
                            <Text color={color}>Tue</Text>
                            <Text color={color}>Aug 3</Text>
                          </VStack>
                        );
                      }}
                    />
                  </HStack>
                  {SectionDivider(0)}
                  {Title("Choose Timeslot")}
                  {SectionDivider(0)}
                  <VStack space={2}>
                    <HStack space={2}>
                      <SelectionButton
                        w={120}
                        active={true}
                        text="8 AM - 10 AM"
                      />
                      <SelectionButton
                        w={120}
                        active={false}
                        text="10 AM - 2 PM"
                      />
                    </HStack>
                    <HStack space={2}>
                      <SelectionButton
                        w={120}
                        active={false}
                        text="2 PM - 6 PM"
                      />
                      <SelectionButton
                        w={120}
                        active={false}
                        text="6 PM - 8 PM"
                      />
                    </HStack>
                    {SectionDivider(0)}
                    {Title("Add Service Note")}
                    <Divider thickness={0} mt={1}></Divider>

                    <TextArea numberOfLines={5} mb={50}></TextArea>
                    <Divider thickness={0} mt={250}></Divider>
                  </VStack>
                </VStack>
              </ScrollView>
            </KeyboardAvoidingView>
          </VStack>
        </PresenceTransition>
      )}
      <FooterButton label="SAVE" onPress={() => goBack()} />
    </AppSafeAreaView>
  );
};

export default EditServiceDetails;
