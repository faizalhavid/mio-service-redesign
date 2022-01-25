import {
  Button,
  Center,
  Checkbox,
  Divider,
  Flex,
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
import { navigate } from "../../navigations/rootNavigation";
import PriceBreakdown from "./PriceBreakdown";

const Payment = (): JSX.Element => {
  const [showTNC, setShowTNC] = React.useState(false);

  return (
    <AppSafeAreaView p={0}>
      <ScrollView mt={100}>
        <VStack space={5}>
          <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
            Order Summary
          </Text>
          <Divider thickness={1} />
          <PriceBreakdown />
          <Divider thickness={10} />
          {/* <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
            Choose Payment Option
          </Text>
          <Divider thickness={1} />
          <Radio.Group
            defaultValue="1"
            name="myRadioGroup"
            accessibilityLabel="Pick your favorite number"
          >
            <VStack
              //   borderColor={"#ddd"}
              //   borderWidth={1}
              //   borderRadius={5}
              width={"98%"}
              mx={5}
              alignItems={"flex-start"}
              alignSelf={"center"}
              justifyContent={"space-around"}
              //   divider={<Divider thickness={1} borderColor={"#eee"} />}
            >
              <Radio ml={2} my={1} value="1">
                Credit Card
              </Radio>
              <Radio ml={2} my={1} value="2">
                Apple Pay
              </Radio>
              <Radio ml={2} my={1} value="3">
                Google Pay
              </Radio>
            </VStack>
          </Radio.Group> */}
          <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
            Choose Credit Card
          </Text>
          <Divider thickness={1} />
          <Radio.Group
            defaultValue="1"
            name="myRadioGroup"
            accessibilityLabel="Pick your favorite number"
          >
            <VStack
              width={"98%"}
              mx={5}
              alignItems={"flex-start"}
              alignSelf={"center"}
              justifyContent={"space-around"}
              //   divider={<Divider thickness={1} borderColor={"#eee"} />}
            >
              <Radio ml={2} my={1} value="1">
                Use saved card ending with XX 1234
              </Radio>
              <Radio ml={2} my={1} value="2">
                Add new card
              </Radio>
            </VStack>
          </Radio.Group>
          <HStack
            bg={AppColors.PRIMARY}
            shadow={3}
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
            <VStack space={5}>
              <Input
                _focus={{
                  borderBottomColor: AppColors.SECONDARY,
                }}
                returnKeyType="next"
                clearButtonMode="always"
                autoCapitalize="none"
                placeholder="CARD NO"
                variant={"underlined"}
                autoCorrect={false}
              />
              <Input
                _focus={{
                  borderBottomColor: AppColors.SECONDARY,
                }}
                returnKeyType="next"
                clearButtonMode="always"
                autoCapitalize="none"
                placeholder="MM/YYYY"
                variant={"underlined"}
                autoCorrect={false}
              />
              <Input
                _focus={{
                  borderBottomColor: AppColors.SECONDARY,
                }}
                returnKeyType="next"
                clearButtonMode="always"
                autoCapitalize="none"
                placeholder="CVV"
                variant={"underlined"}
                autoCorrect={false}
              />
            </VStack>
          </View>
          <Divider thickness={10} />
          <Text textAlign={"center"} fontSize={18} fontWeight={"semibold"}>
            Choose Billing Address
          </Text>
          <Divider thickness={1} />
          <Radio.Group
            alignSelf={"center"}
            defaultValue="1"
            name="myRadioGroup"
            accessibilityLabel="Pick your favorite number"
          >
            <Radio value="1" my={1}>
              Billing address is same as service address
            </Radio>
            <Radio value="2" my={1}>
              Update Billing Address
            </Radio>
          </Radio.Group>
          <VStack px={5} space={5}>
            <Input
              _focus={{
                borderBottomColor: AppColors.SECONDARY,
              }}
              returnKeyType="next"
              clearButtonMode="always"
              autoCapitalize="none"
              placeholder="NAME"
              variant={"underlined"}
              autoCorrect={false}
            />
            <Input
              _focus={{
                borderBottomColor: AppColors.SECONDARY,
              }}
              returnKeyType="next"
              clearButtonMode="always"
              autoCapitalize="none"
              placeholder="ADDRESS"
              variant={"underlined"}
              autoCorrect={false}
            />
            <Input
              _focus={{
                borderBottomColor: AppColors.SECONDARY,
              }}
              returnKeyType="next"
              clearButtonMode="always"
              autoCapitalize="none"
              placeholder="CITY"
              variant={"underlined"}
              autoCorrect={false}
            />
            <Input
              _focus={{
                borderBottomColor: AppColors.SECONDARY,
              }}
              returnKeyType="next"
              clearButtonMode="always"
              autoCapitalize="none"
              placeholder="STATE"
              variant={"underlined"}
              autoCorrect={false}
            />
            <Input
              _focus={{
                borderBottomColor: AppColors.SECONDARY,
              }}
              returnKeyType="next"
              clearButtonMode="always"
              autoCapitalize="none"
              placeholder="ZIPCODE"
              variant={"underlined"}
              autoCorrect={false}
            />
          </VStack>
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
        subText="Provide payment information in next step"
        onPress={() => navigate("Booked")}
      />
    </AppSafeAreaView>
  );
};

export default Payment;
