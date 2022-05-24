import {
  Alert,
  Button,
  Center,
  Pressable,
  Text,
  Toast,
  View,
  VStack,
} from "native-base";
import React, { useEffect } from "react";
import { SvgCss } from "react-native-svg";
import { EXCLAMATION_ICON } from "../../commons/assets";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import { useAuth } from "../../contexts/AuthContext";
import { navigate } from "../../navigations/rootNavigation";

const VerifyEmail = (): JSX.Element => {
  const { currentUser, resendEmail } = useAuth();

  useEffect(() => {
    if (currentUser) {
      resendEmail();
    }
  }, [currentUser]);

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
            Please click on the email verification link sent to mail. {"\n"}
          </Text>

          <Text color={AppColors.SECONDARY}>
            Not received verification link?{" "}
            <Text
              onPress={async () => {
                Toast.show({ title: "Verification Mail Sent!" });
                await resendEmail();
              }}
              fontWeight={"semibold"}
              color={AppColors.TEAL}
            >
              Send again
            </Text>
          </Text>
          <Button
            mt={10}
            w="xs"
            height={50}
            bg={AppColors.TEAL}
            _text={{ color: "white" }}
            onPress={() => navigate("Login")}
          >
            LOGIN
          </Button>
        </Center>
      </VStack>
    </AppSafeAreaView>
  );
};

export default VerifyEmail;
