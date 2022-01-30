import {
  Box,
  Center,
  Divider,
  Flex,
  FormControl,
  HStack,
  Input,
  ScrollView,
  Stack,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { Platform } from "react-native";
import { AppColors } from "../../commons/colors";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import SocialLoginButton from "../../components/SocialLoginButton";
import Spacer from "../../components/Spacer";
import { navigate } from "../../navigations/rootNavigation";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AppInput from "../../components/AppInput";

const Register = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  GoogleSignin.configure({
    webClientId:
      "528727320506-qnn462uhd5d3bac306fg6bkdhs156mhp.apps.googleusercontent.com",
  });

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const isSignedin = await GoogleSignin.isSignedIn();
      if (isSignedin) {
        await GoogleSignin.signOut();
        return;
      }
      if (!isSignedin) {
        const userInfo = await GoogleSignin.signIn();
        console.log(userInfo);
        console.log("----------");
        const googleCredential = auth.GoogleAuthProvider.credential(
          userInfo.idToken
        );
        const credential = auth().signInWithCredential(googleCredential);
      }
      // const currentUser = await GoogleSignin.getCurrentUser();
      // console.log(currentUser);

      // Sign-in the user with the credential
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppSafeAreaView loading={loading}>
      <Center width={"100%"}>
        <Text fontSize={20}>Create an account</Text>
        <Text fontSize={20}>to manage your service</Text>
      </Center>
      <ScrollView>
        <Flex flexDirection={"column"} flex={1} paddingX={5} mt={10}>
          <AppInput type="text" label="Name" lineWidth={1} />
          <AppInput type="number" label="Phone" />
          <AppInput type="email" label="Email" />
          <AppInput type="password" label="Password" lineWidth={1} />
          <Spacer top={40} />
          <HStack justifyContent={"center"}>
            <Divider my="5" />
            <Center
              position={"absolute"}
              top={2}
              background={"white"}
              _text={{
                color: "gray.400",
              }}
            >
              or
            </Center>
          </HStack>
          <Spacer top={40} />
          <VStack justifyContent={"center"} space={2} width={"100%"}>
            <SocialLoginButton type="Google" onPress={loginWithGoogle} />
            <SocialLoginButton type="Facebook" onPress={() => {}} />
            <SocialLoginButton type="Apple" onPress={() => {}} />
          </VStack>
        </Flex>
        <Divider thickness={0} mt={100} />
      </ScrollView>
      <FooterButton
        label="CREATE ACCOUNT"
        subText="Provide address in next step"
        onPress={() => navigate("Address", { mode: "CREATE" })}
      />
    </AppSafeAreaView>
  );
};

export default Register;
