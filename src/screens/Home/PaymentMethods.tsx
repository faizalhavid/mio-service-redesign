import {
  Button,
  Center,
  Divider,
  HStack,
  KeyboardAvoidingView,
  Radio,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { goBack } from "../../navigations/rootNavigation";

const PaymentMethods = (): JSX.Element => {
  return (
    <AppSafeAreaView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}>
        <ScrollView>
          <Center>
            <Text fontSize={20} pt={5}>
              Payment Methods
            </Text>
          </Center>
          <Divider thickness={0} mt={5} />
          <HStack
            bg={AppColors.PRIMARY}
            shadow={2}
            px={6}
            py={2}
            justifyContent={"space-between"}
            alignContent={"center"}
          >
            <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
              Default Payment Source
            </Text>
          </HStack>
          <View px={5} py={5}>
            <Radio.Group
              defaultValue="1"
              name="myRadioGroup"
              accessibilityLabel="Pick your favorite number"
            >
              <Radio value="1" my={1}>
                <HStack
                  ml={2}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width={"90%"}
                >
                  <Text>XXXX-XXXX-XXXX-1234</Text>
                  <Text fontSize={12} color={"amber.600"}>
                    DELETE
                  </Text>
                </HStack>
              </Radio>
              <Radio value="2" my={1}>
                <HStack
                  ml={2}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  width={"90%"}
                >
                  <Text>XXXX-XXXX-XXXX-1234</Text>
                  <Text fontSize={12} color={"amber.600"}>
                    DELETE
                  </Text>
                </HStack>
              </Radio>
            </Radio.Group>
          </View>
          <Divider thickness={0} mt={5} />
          <HStack
            bg={AppColors.PRIMARY}
            shadow={2}
            px={6}
            py={2}
            justifyContent={"space-between"}
            alignContent={"center"}
          >
            <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
              Add New Credit Card
            </Text>
          </HStack>
          <View px={5} py={5}>
            <VStack>
              <AppInput type={"number"} label={"CREDIT CARD"} />
              <AppInput type={"number"} label={"EXPIRATION"} />
              <AppInput type={"number"} label={"SECURITY CODE"} />
              <Divider thickness={0} mt={10} />
              <Button bg={AppColors.DARK_PRIMARY}>
                <Text color={"#fff"}>Add</Text>
              </Button>
            </VStack>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <FooterButton
        label="SAVE PAYMENT METHOD"
        subText="Provide payment information in next step"
        onPress={() => goBack()}
      />
    </AppSafeAreaView>
  );
};

export default PaymentMethods;
