import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  Button,
  Center,
  Divider,
  ScrollView,
  Text,
  useToast,
  VStack,
} from "native-base";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { AppColors } from "../../commons/colors";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import SocialLogin from "../../components/SocialLogin";
import Spacer from "../../components/Spacer";
import { useAuth } from "../../contexts/AuthContext";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import auth from "@react-native-firebase/auth";
import appleAuth from "@invertase/react-native-apple-authentication";
import ErrorView from "../../components/ErrorView";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { StorageHelper } from "../../services/storage-helper";
import { FLAG_TYPE, STATUS } from "../../commons/status";
import { useMutation } from "react-query";
import { getCustomer } from "../../services/customer";
import ForgetPassword from "../../components/ForgetPassword";

type LoginFormType = {
  email: string;
  password: string;
};

const Login = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [showForgetPasswordForm, setShowForgetPasswordForm] =
    React.useState<boolean>(false);
  const toast = useToast();
  const { login, resetPassword } = useAuth();

  const { control, handleSubmit, formState, trigger } = useForm<LoginFormType>({
    mode: "onChange",
  });

  const { mutateAsync: getCustomerMutation } = useMutation(
    "getCustomer",
    (customerId: string | null) => {
      console.log("Get Customer Profile", customerId);
      setLoading(true);
      return getCustomer(customerId);
    },
    {
      onSuccess: (data) => {
        console.log("Customer response ", data.data);
        setLoading(false);
      },
      onError: (err) => {
        setErrorMsg("Please Register before trying to Login");
        setLoading(false);
      },
    }
  );

  const doLogin = async (userCredential: FirebaseAuthTypes.UserCredential) => {
    setErrorMsg("");
    let token = await userCredential.user.getIdToken();
    StorageHelper.setValue("TOKEN", token);
    getCustomerMutation(userCredential.user.email).then(async () => {
      let navigateTo = "";
      if (!userCredential.user.emailVerified) {
        await StorageHelper.setValue(
          FLAG_TYPE.EMAIL_VERIFICATION_STATUS,
          STATUS.PENDING
        );
        navigateTo = "VERIFY_EMAIL";
      } else {
        await StorageHelper.setValue(
          FLAG_TYPE.ALL_INITIAL_SETUP_COMPLETED,
          STATUS.COMPLETED
        );
        navigateTo = "HOME";
      }
      let addressDetailsStatus = await StorageHelper.getValue(
        FLAG_TYPE.ADDRESS_DETAILS_STATUS
      );
      if (addressDetailsStatus === STATUS.PENDING) {
        navigateTo = "UPDATE_ADDRESS";
      }
      switch (navigateTo) {
        case "UPDATE_ADDRESS":
          popToPop("Address");
          break;
        case "VERIFY_EMAIL":
          popToPop("VerifyEmail");
          break;
        case "HOME":
          popToPop("Dashboard");
      }
    });
  };

  const [errorMsg, setErrorMsg] = React.useState("");
  const onSubmit = async (data: LoginFormType) => {
    setLoading(true);
    setErrorMsg("");
    login(data.email, data.password)
      .then((userCredential) => {
        doLogin(userCredential);
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
        <VStack mt={70} paddingX={5}>
          <Center width={"100%"}>
            <Text color={AppColors.SECONDARY} fontSize={30}>
              Login
            </Text>
          </Center>
          <VStack mt={10}>
            <ErrorView message={errorMsg} />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, value } }) => (
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
              render={({ field: { onChange, value } }) => (
                <AppInput
                  type="password"
                  label="Password"
                  onChange={onChange}
                  value={value}
                />
              )}
              name="password"
            />
            <Button
              variant={"ghost"}
              _pressed={{ bg: "transparent" }}
              textAlign="right"
              p={0}
              justifyContent="flex-end"
              onPress={() => setShowForgetPasswordForm(true)}
            >
              <Text color={AppColors.SECONDARY}>Forgot Password?</Text>
            </Button>
            <Spacer top={30} />
            <Center>
              <AppButton
                label="SIGN IN"
                onPress={async (event) => {
                  setErrorMsg("");
                  await trigger();
                  console.log(formState.errors);
                  console.log("isDirty", formState.isDirty);
                  if (
                    (!formState.isDirty && !formState.isValid) ||
                    Object.keys(formState.errors).length > 0
                  ) {
                    setErrorMsg("Please provide valid email/password");
                    return;
                  }

                  handleSubmit(onSubmit)(event).catch((error) => {
                    setErrorMsg(error);
                  });
                }}
              />
            </Center>
          </VStack>
          <Spacer top={20} />
          <SocialLogin
            label={"Login"}
            loginWithGoogle={async () => {
              try {
                setLoading(true);
                const userInfo = await GoogleSignin.signIn();
                const googleCredential = auth.GoogleAuthProvider.credential(
                  userInfo.idToken
                );
                const userCredential = await auth().signInWithCredential(
                  googleCredential
                );
                doLogin(userCredential);
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

                if (!appleAuthRequestResponse.email) {
                  setErrorMsg(
                    "Please choose email id while chooce apple login"
                  );
                  return;
                }

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

                doLogin(userCredential);
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
      <ForgetPassword
        showForgetPasswordForm={showForgetPasswordForm}
        setShowForgetPasswordForm={setShowForgetPasswordForm}
        onSumbit={(email: string): void => {
          setShowForgetPasswordForm(false);
          resetPassword(email);
          toast.show({
            title: "Please check your email for the password reset link.",
            placement: "top",
            mt: 20,
          });
        }}
      />
    </AppSafeAreaView>
  );
};

export default Login;
