import {
  Center,
  CheckIcon,
  Flex,
  Input,
  Select,
  Spacer,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppButton from "../../components/AppButton";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { navigate } from "../../navigations/rootNavigation";

const content = (
  <>
    <VStack paddingX={5} mt={10}>
      <Center width={"100%"}>
        <Text fontSize={20}>Enter your address</Text>
      </Center>
      <VStack mt={10} space={5}>
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
        <Select
          minWidth="200"
          accessibilityLabel="STATE"
          placeholder="STATE"
          _selectedItem={{
            bg: AppColors.PRIMARY,
            endIcon: <CheckIcon size="5" />,
          }}
          variant="underlined"
        >
          <Select.Item label="UX Research" value="ux" />
          <Select.Item label="Web Development" value="web" />
          <Select.Item label="Cross Platform Development" value="cross" />
          <Select.Item label="UI Designing" value="ui" />
          <Select.Item label="Backend Development" value="backend" />
        </Select>
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
    </VStack>
    <FooterButton
      label="SAVE ADDRESS"
      subText="Choose Service in next step"
      onPress={() => navigate("ChooseService")}
    />
  </>
);

const Address = (): JSX.Element => {
  return <AppSafeAreaView>{content}</AppSafeAreaView>;
};

export default Address;
