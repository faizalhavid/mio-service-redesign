import { NativeStackScreenProps } from "@react-navigation/native-stack";
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
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { SuperRootStackParamList } from "../../navigations";
import { navigate } from "../../navigations/rootNavigation";

type AddressProps = NativeStackScreenProps<SuperRootStackParamList, "Address">;
const Address = ({ route }: AddressProps): JSX.Element => {
  const { mode } = route.params;

  const isUpdate = mode === "UPDATE";

  return (
    <AppSafeAreaView>
      <VStack paddingX={5} mt={10}>
        <Center width={"100%"}>
          <Text fontSize={20}>
            {isUpdate ? "Update" : "Enter"} your address
          </Text>
        </Center>
        <VStack mt={10} space={0}>
          <AppInput type="text" label="Address" />
          <AppInput type="text" label="City" />
          <AppInput type="text" label="State" lineWidth={1} />
          {/* <Select
            minWidth="200"
            accessibilityLabel="STATE"
            placeholder="State"
            borderBottomWidth={1.5}
            borderBottomColor={"#ddd"}
            _selectedItem={{
              bg: AppColors.PRIMARY,
              endIcon: <CheckIcon size="5" />,
            }}
            fontSize={14}
            p={0}
            m={0}
            variant="underlined"
          >
            <Select.Item pl={0} m={0} label="UX Research" value="ux" />
            <Select.Item label="Web Development" value="web" />
            <Select.Item label="Cross Platform Development" value="cross" />
            <Select.Item label="UI Designing" value="ui" />
            <Select.Item label="Backend Development" value="backend" />
          </Select> */}
          <AppInput type="number" label="Zipcode" />
        </VStack>
      </VStack>
      <FooterButton
        label={(isUpdate ? "UPDATE" : "SAVE") + " ADDRESS"}
        subText="Choose Service in next step"
        onPress={() => navigate("ChooseService")}
      />
    </AppSafeAreaView>
  );
};

export default Address;
