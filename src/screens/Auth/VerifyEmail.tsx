import { Button, Center, Text, View, VStack } from "native-base";
import React from "react";
import { SvgCss } from "react-native-svg";
import { useMutation } from "react-query";
import { EXCLAMATION_ICON } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { useAuth } from "../../contexts/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCustomer } from "../../services/customer";
import { navigate, popToPop } from "../../navigations/rootNavigation";

const VerifyEmail = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [customerId, setCustomerId] = React.useState(null);
  AsyncStorage.getItem("CUSTOMER_ID").then((value: any) => {
    setCustomerId(value);
  });
  const getCustomerMutation = useMutation(
    "getCustomer",
    () => {
      setLoading(true);
      return getCustomer(customerId);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        popToPop("Address");
      },
      onError: (err) => {
        setLoading(false);
      },
    }
  );
  const { currentUser, reload, resendEmail } = useAuth();

  return (
    <AppSafeAreaView>
      <VStack mt={5}>
        <Center p={10}>
          <View mt={20}>
            <SvgCss width={75} height={75} xml={EXCLAMATION_ICON("#9fd297")} />
          </View>
          <Text
            textAlign={"center"}
            color={AppColors.DARK_PRIMARY}
            fontSize={20}
            mt={10}
            fontWeight="semibold"
          >
            Email Verification Pending
          </Text>
          <Text
            mt={5}
            textAlign={"center"}
            color={AppColors.SECONDARY}
            fontWeight="semibold"
          >
            Please check your mail inbox and click on the email verification
            link. {"\n"}
            Login once mail verification is completed.
          </Text>
          <Button
            mt={10}
            colorScheme={"blue"}
            variant={"ghost"}
            onPress={async () => {
              await resendEmail();
            }}
          >
            Resend Mail
          </Button>
        </Center>
      </VStack>
      <FooterButton
        label={"Login"}
        subText="Provide address in next step"
        onPress={() => navigate("Login")}
      />
    </AppSafeAreaView>
  );
};

export default VerifyEmail;
