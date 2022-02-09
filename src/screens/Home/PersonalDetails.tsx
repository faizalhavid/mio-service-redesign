import {
  Button,
  Center,
  Divider,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { goBack, navigate } from "../../navigations/rootNavigation";

const PersonalDetails = (): JSX.Element => {
  const Header = (text: string) => {
    return (
      <Center>
        <Divider thickness={1} width={"90%"} bgColor={AppColors.SECONDARY} />
        <Button
          mt={-4}
          p={1}
          bg={"#fff"}
          borderColor={AppColors.SECONDARY}
          _text={{
            color: AppColors.SECONDARY,
            fontSize: 12,
          }}
          width={"40%"}
          variant={"outline"}
          borderRadius={20}
        >
          {text}
        </Button>
      </Center>
    );
  };
  return (
    <AppSafeAreaView>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={0}>
        <ScrollView>
          <VStack>
            <Center>
              <Text fontSize={20} pt={5}>
                Personal Details
              </Text>
            </Center>
            <Divider thickness={0} mt={10} />
            {Header("Current Information")}
            <Center>
              <Divider thickness={0} mt={5} />
              <Text fontWeight={"semibold"}>Haylie Korsgaard</Text>
              <Text>1234 Main St.</Text>
              <Text>Austin, Tx 77022</Text>
              <Text>(512) 222-2222</Text>
              <Text>haylie.korsgaard@gmail.com</Text>
            </Center>
            <Divider thickness={0} mt={10} />
            {Header("Update")}
            <Divider thickness={0} mt={10} />
            <VStack px={5}>
              <AppInput type="text" label="NAME" />
              <AppInput type="text" label="ADDRESS" />
              <AppInput type="text" label="CITY" />
              <AppInput type="text" label="ZIP CODE" />
              <AppInput type="text" label="PHONE NUMBER" />
              <AppInput type="text" label="EMAIL ADDRESS" />
            </VStack>
          </VStack>
          <Divider thickness={0} mt={220}></Divider>
        </ScrollView>
      </KeyboardAvoidingView>
      <FooterButton
        label="UPDATE"
        subText="Provide payment information in next step"
        onPress={() => goBack()}
      />
    </AppSafeAreaView>
  );
};

export default PersonalDetails;
