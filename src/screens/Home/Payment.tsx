import {
  Button,
  Center,
  Divider,
  HStack,
  Input,
  Radio,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import TermsAndConditions from "../../components/TermsAndConditions";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import PriceBreakdown from "./PriceBreakdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppInput from "../../components/AppInput";

const Payment = (): JSX.Element => {
  const [showTNC, setShowTNC] = React.useState(false);
  const [selectedCreditcard, setSelectedCreditcard] = React.useState("1234");

  return (
    <AppSafeAreaView>
      <ScrollView>
        <VStack space={5}>
          <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
            Choose Credit Card
          </Text>
          <Divider thickness={1} />
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
                <Text fontSize={15} pl={2}>
                  Use Saved Card{" "}
                  <Text color={"gray.400"}>XXXX-XXXX-XXX-1234</Text>
                </Text>
              </Radio>
              <Radio ml={2} my={1} value="NEW">
                <Text fontSize={15} pl={2}>
                  Add Credit Card
                </Text>
              </Radio>
            </VStack>
          </Radio.Group>
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

          <Divider thickness={10} />
        </VStack>
        <Center px={5} py={5}>
          <Button
            pt={5}
            m={0}
            variant={"link"}
            onPress={() => setShowTNC(true)}
          >
            <Text textAlign={"center"}>
              By clicking "Submit Payment" your agree to {"\n"}our{" "}
              <Text color={"blue.500"}>terms & conditions</Text>
            </Text>
          </Button>
        </Center>
        <Divider thickness={0} mt={0} mb={200} />
      </ScrollView>
      <TermsAndConditions show={showTNC} setShow={setShowTNC} />
      <FooterButton
        label="SUBMIT PAYMENT"
        disabled={selectedCreditcard === "NEW"}
        subText="Choose credit card for payment"
        onPress={async () => {
          await AsyncStorage.removeItem("LEAD_ID");
          popToPop("Booked");
        }}
      />
    </AppSafeAreaView>
  );
};

export default Payment;
