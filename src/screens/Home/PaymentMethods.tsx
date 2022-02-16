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
  const [selectedCreditcard, setSelectedCreditcard] = React.useState("1234");
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
          <View px={2} pt={4}>
            <Radio.Group
              defaultValue={selectedCreditcard}
              name="myRadioGroup"
              accessibilityLabel="Choose"
              onChange={(nextValue) => {
                setSelectedCreditcard(nextValue);
              }}
            >
              <VStack
                width={"98%"}
                mx={5}
                alignItems={"flex-start"}
                alignSelf={"center"}
                justifyContent={"space-around"}
              >
                <Radio ml={2} my={1} value="1234">
                  XXXX-XXXX-XXXX-1234
                </Radio>
                <Radio ml={2} my={1} value="NEW">
                  Add Credit Card
                </Radio>
              </VStack>
            </Radio.Group>
          </View>
          <Divider thickness={0} mt={5} />
          {selectedCreditcard === "NEW" && (
            <>
              <HStack
                bg={AppColors.PRIMARY}
                shadow={2}
                px={6}
                py={2}
                justifyContent={"space-between"}
                alignContent={"center"}
              >
                <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
                  Add Credit Card
                </Text>
              </HStack>
              <View px={5}>
                <AppInput type="number" label="Card Number" />
                <AppInput
                  type="number"
                  expiry={true}
                  label="Valid thru (MM/YYYY)"
                />
                <AppInput type="password" label="CVV" />
                <Button mt={5} bg={AppColors.DARK_PRIMARY}>
                  <Text color={"#fff"}>Add</Text>
                </Button>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
      <FooterButton
        label="SAVE PAYMENT METHOD"
        disabled={selectedCreditcard === "NEW"}
        subText="Choose default payment method or add new card"
        onPress={() => goBack()}
      />
    </AppSafeAreaView>
  );
};

export default PaymentMethods;
