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
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import appleAuth from "@invertase/react-native-apple-authentication";
import { useIsFocused } from "@react-navigation/native";
import { AppColors } from "../../commons/colors";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import SocialLogin from "../../components/SocialLogin";
import Spacer from "../../components/Spacer";
import {
  CustomerProfile,
  dummyProfile,
  Phone,
  useAuth,
} from "../../contexts/AuthContext";
import { popToPop } from "../../navigations/rootNavigation";
import ErrorView from "../../components/ErrorView";
import { StorageHelper } from "../../services/storage-helper";
import { FLAG_TYPE, STATUS } from "../../commons/status";
import ForgetPassword from "../../components/ForgetPassword";
import { useAnalytics } from "../../services/analytics";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import {
  getCustomerExistsAsync,
  registerCustomerAsync,
  selectCustomer,
  setCustomerState,
} from "../../slices/customer-slice";
import { FAILED, INIT, IN_PROGRESS } from "../../commons/ui-states";
import { useAppSelector } from "../../hooks/useAppSelector";
import { SAMPLE } from "../../commons/sample";
import GradientButton from "../../components/GradientButton";

type LoginFormType = {
  email: string;
  password: string;
};

function Login(): JSX.Element {
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
  const socialLoginCompleted = React.useRef<boolean>(false);

  const { logEvent } = useAnalytics();

  const isFocussed = useIsFocused();

  useEffect(() => {
    if (isFocussed) {
      dispatch(setCustomerState({ uiState: INIT }));
    }
  }, [isFocussed]);

  const { uiState, member: customer, error } = useAppSelector(selectCustomer);

  const doLogin = async (userCredential: FirebaseAuthTypes.UserCredential) => {
    dispatch(setCustomerState({ uiState: IN_PROGRESS }));
    const token = await userCredential.user.getIdToken();
    const {email} = userCredential.user;
    await StorageHelper.setValue("TOKEN", token);
    console.log("userCredential.user.email", email);
    const result = await dispatch(getCustomerExistsAsync(email));
    // console.log("result", result);
    // console.log("result.meta.requestStatus", result.meta.requestStatus);
    // console.log("value", result.payload);
    // if (
    //   !result?.payload?.customerId ||
    //   result.meta.requestStatus === "rejected"
    // ) {
    if (!result.payload.isExist) {
      // console.log("User not exist");
      if (socialLoginCompleted.current) {
        const payload: CustomerProfile = {
          ...dummyProfile,
          ...{
            email: userCredential.user.email || "",
          },
          uid: userCredential.user.uid,
          phones: [
            {
              ...({} as Phone),
              number: "",
            },
          ],
          customerId: userCredential.user.email || "",
        };
        // console.log("payload", payload);
        const registeredResult = await dispatch(
          registerCustomerAsync({ ...payload })
        );
        // console.log("meta", registeredResult.meta);
        // console.log("registeredResult", registeredResult.payload);
        if (registeredResult.meta.requestStatus === "rejected") {
          dispatch(
            setCustomerState({
              uiState: FAILED,
              error: "Something went wrong! Please try again!",
            })
          );
          return;
        }
      }
    }
    // }
    // console.log("outside");
    let navigateTo = "";
    if (!userCredential.user.emailVerified) {
      await StorageHelper.setValue(
        FLAG_TYPE.EMAIL_VERIFICATION_STATUS,
        STATUS.PENDING
      );
      navigateTo = "VERIFY_EMAIL";
    } else {
      await StorageHelper.setValue(FLAG_TYPE.AUTHENTICATED_USER, STATUS.TRUE);
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
            error,
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
        <VStack mt="1/3" paddingX={5}>
          <Center width="100%">
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
              variant="ghost"
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
                disabled={!loginForm.formState.isValid}
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
                          error,
                        })
                      );
                    });
                }}
              />
            </Center>
          </VStack>
          <Spacer top={20} />
          <SocialLogin
            label="Sign in"
            loginWithGoogle={async () => {
              try {
                dispatch(
                  setCustomerState({
                    uiState: IN_PROGRESS,
                  })
                );
                logEvent("login_google_event");
                console.log("GoogleLogin");
                const userInfo = await GoogleSignin.signIn();
                const googleCredential = auth.GoogleAuthProvider.credential(
                  userInfo.idToken
                );
                const userCredential = await auth().signInWithCredential(
                  googleCredential
                );
                socialLoginCompleted.current = true;
                doLogin(userCredential);
              } catch (error) {
                console.log("GoogleLoginError");
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
                socialLoginCompleted.current = true;
                console.log("AppleLogin");
                doLogin(userCredential);
              } catch (error) {
                console.log("AppleLoginError");
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
}

export default Login;
