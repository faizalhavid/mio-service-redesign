import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Center, Divider, ScrollView, Text, VStack } from "native-base";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { AppColors } from "../../commons/colors";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import SocialLogin from "../../components/SocialLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spacer from "../../components/Spacer";
import { useAuth } from "../../contexts/AuthContext";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import auth from "@react-native-firebase/auth";
import { getCustomer } from "../../services/customer";
import appleAuth from "@invertase/react-native-apple-authentication";

type LoginFormType = {
  email: string;
  password: string;
};

const Login = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);

  const { login, currentUser } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginFormType>({
    defaultValues: {},
    mode: "onChange",
  });

  const [errorMsg, setErrorMsg] = React.useState("");
  const onSubmit = async (data: LoginFormType) => {
    setLoading(true);
    setErrorMsg("");
    login(data.email, data.password)
      .then((status) => {
        switch (status) {
          case "VERIFY_EMAIL":
            popToPop("VerifyEmail");
            break;
          case "HOME":
            popToPop("Dashboard");
        }
      })
      .catch((error) => {
        setErrorMsg(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <AppSafeAreaView statusBarColor="#fff" loading={loading}>
      <ScrollView>
        <VStack mt={100} paddingX={5}>
          <Center width={"100%"}>
            <Text fontSize={20}>Login</Text>
          </Center>
          <VStack mt={10}>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="email"
                  label="Email"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="email"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <AppInput
                  type="password"
                  label="Password"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="password"
            />
            <Spacer top={40} />
            {errorMsg.length > 0 && (
              <Center mb={10}>
                <Text color={"red.500"} fontWeight="semibold">
                  {errorMsg}
                </Text>
              </Center>
            )}
            <Center>
              <AppButton label="SIGN IN" onPress={handleSubmit(onSubmit)} />
            </Center>
          </VStack>
          <Spacer top={20} />
          <SocialLogin
            label={"Login"}
            loginWithGoogle={async () => {
              try {
                const userInfo = await GoogleSignin.signIn();

                const googleCredential = auth.GoogleAuthProvider.credential(
                  userInfo.idToken
                );
                const userCredential = await auth().signInWithCredential(
                  googleCredential
                );
                await AsyncStorage.setItem(
                  "APP_START_STATUS",
                  "SETUP_COMPLETED"
                );
                popToPop("Dashboard");
              } catch (error) {
                console.log(error);
              }
            }}
            loginWithApple={async () => {
              try {
                const appleAuthRequestResponse = await appleAuth.performRequest(
                  {
                    requestedOperation: appleAuth.Operation.LOGIN,
                    requestedScopes: [
                      appleAuth.Scope.EMAIL,
                      appleAuth.Scope.FULL_NAME,
                    ],
                  }
                );

                // Ensure Apple returned a user identityToken
                if (!appleAuthRequestResponse.identityToken) {
                  console.log(
                    "Apple Sign-In failed - no identify token returned"
                  );
                }

                // Create a Firebase credential from the response
                const { identityToken, nonce } = appleAuthRequestResponse;
                const appleCredential = auth.AppleAuthProvider.credential(
                  identityToken,
                  nonce
                );

                // Sign the user in with the credential
                const userCredential = await auth().signInWithCredential(
                  appleCredential
                );
                console.log("credential", userCredential);

                await AsyncStorage.setItem(
                  "APP_START_STATUS",
                  "SETUP_COMPLETED"
                );
                popToPop("Dashboard");
              } catch (error) {
                console.log(error);
              } finally {
                setLoading(false);
              }
            }}
          />
          <Divider my="5" />
          <Center size="16" width={"100%"}>
            Already have an account?
          </Center>
          <Center>
            <AppButton
              color={AppColors.SECONDARY}
              label="SIGN UP FOR FREE"
              onPress={() => navigate("Register")}
            />
          </Center>
          <Divider thickness={0} mt={20} />
        </VStack>
      </ScrollView>
    </AppSafeAreaView>
  );
};

export default Login;
