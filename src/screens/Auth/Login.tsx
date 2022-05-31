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
import ForgetPassword from "../../components/ForgetPassword";
import { useAnalytics } from "../../services/analytics";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  getCustomerByIdAsync,
  selectCustomer,
  setCustomerState,
} from "../../slices/customer-slice";
import { FAILED, IN_PROGRESS } from "../../commons/ui-states";
import { useAppSelector } from "../../hooks/useAppSelector";
import { SAMPLE } from "../../commons/sample";
import GradientButton from "../../components/GradientButton";

type LoginFormType = {
  email: string;
  password: string;
};

const Login = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [showForgetPasswordForm, setShowForgetPasswordForm] =
    React.useState<boolean>(false);
  const toast = useToast();
  const { login, resetPassword } = useAuth();
  const loginForm = useForm<LoginFormType>({
    defaultValues: {
      email: SAMPLE.EMAIL,
      password: SAMPLE.PASSWORD,
    },
    mode: "all",
  });

  const { logEvent } = useAnalytics();

  const { uiState, member: customer, error } = useAppSelector(selectCustomer);

  const doLogin = async (userCredential: FirebaseAuthTypes.UserCredential) => {
    let token = await userCredential.user.getIdToken();
    StorageHelper.setValue("TOKEN", token);
    await dispatch(getCustomerByIdAsync(userCredential.user.email));
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
    switch (navigateTo) {
      case "VERIFY_EMAIL":
        popToPop("VerifyEmail");
        break;
      case "HOME":
        popToPop("Dashboard");
    }
  };

  const onSubmit = async (data: LoginFormType) => {
    logEvent("login_email_event");
    login(data.email.trim(), data.password)
      .then((userCredential) => {
        doLogin(userCredential);
      })
      .catch((error) => {
        dispatch(
          setCustomerState({
            uiState: FAILED,
            error: error,
          })
        );
      });
  };
  return (
    <AppSafeAreaView
      mt={60}
      statusBarColor="#fff"
      loading={uiState === IN_PROGRESS}
    >
      <ScrollView>
        <VStack mt={"1/3"} paddingX={5}>
          <Center width={"100%"}>
            <Text color={AppColors.SECONDARY} fontSize={30}>
              Login
            </Text>
          </Center>
          <VStack mt={10}>
            {uiState === FAILED && <ErrorView message={error} />}
            <Controller
              control={loginForm.control}
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
              control={loginForm.control}
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
              <GradientButton
                text="SIGN IN"
                onPress={async (event) => {
                  await loginForm.trigger();
                  if (
                    (loginForm.formState.isDirty &&
                      !loginForm.formState.isValid) ||
                    Object.keys(loginForm.formState.errors).length > 0
                  ) {
                    dispatch(
                      setCustomerState({
                        uiState: FAILED,
                        error: "Please provide valid email/password",
                      })
                    );
                    return;
                  }
                  loginForm
                    .handleSubmit(onSubmit)(event)
                    .catch((error) => {
                      console.log(error);
                      dispatch(
                        setCustomerState({
                          uiState: FAILED,
                          error: error,
                        })
                      );
                    });
                }}
              />
            </Center>
          </VStack>
          <Spacer top={20} />
          <SocialLogin
            label={"Sign in"}
            loginWithGoogle={async () => {
              try {
                dispatch(
                  setCustomerState({
                    uiState: IN_PROGRESS,
                  })
                );
                logEvent("login_google_event");
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
                logEvent("login_apple_event");
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

                if (!userCredential.user.email) {
                  dispatch(
                    setCustomerState({
                      uiState: FAILED,
                      error: "Please choose emailId in apple login",
                    })
                  );
                  return;
                }

                doLogin(userCredential);
              } catch (error) {
                console.log(error);
              } finally {
                setCustomerState({
                  uiState: IN_PROGRESS,
                });
              }
            }}
          />
          {/* <Divider my="5" />
          <Center size="16" width={"100%"}>
            Don't have an account?
          </Center>
          <Center>
            <AppButton
              color={AppColors.SECONDARY}
              label="SIGN UP FOR FREE"
              onPress={() => navigate("Register")}
            />
          </Center> */}
          <Divider thickness={0} mt={20} />
        </VStack>
      </ScrollView>
      <ForgetPassword
        showForgetPasswordForm={showForgetPasswordForm}
        setShowForgetPasswordForm={setShowForgetPasswordForm}
        onSumbit={(email: string): void => {
          setShowForgetPasswordForm(false);
          resetPassword(email)
            .then(() => {
              toast.show({
                title: "Please check your email for the password reset link.",
                placement: "top",
                mt: 20,
              });
            })
            .catch((err) => {
              if (
                err &&
                err.message &&
                err.message.indexOf("auth/user-not-found")
              ) {
                toast.show({
                  title: "User not found. Please Register.",
                  placement: "top",
                  mt: 20,
                });
              }
            });
        }}
      />
    </AppSafeAreaView>
  );
};

export default Login;
