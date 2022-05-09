import { Button, Center, Divider, Flex, Text } from "native-base";
import React, { useRef } from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import Spacer from "../../components/Spacer";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AppInput from "../../components/AppInput";
import appleAuth from "@invertase/react-native-apple-authentication";
import { Controller, useForm } from "react-hook-form";
import { popToPop } from "../../navigations/rootNavigation";
import {
  CustomerProfile,
  dummyProfile,
  Phone,
  RegisterForm,
  useAuth,
} from "../../contexts/AuthContext";
import SocialLogin from "../../components/SocialLogin";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../commons/colors";
import ErrorView from "../../components/ErrorView";
import { FLAG_TYPE, STATUS } from "../../commons/status";
import { StorageHelper } from "../../services/storage-helper";
import { useAnalytics } from "../../services/analytics";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  registerCustomerAsync,
  selectCustomer,
  setCustomerState,
} from "../../slices/customer-slice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { FAILED, IN_PROGRESS } from "../../commons/ui-states";
import { SAMPLE } from "../../commons/sample";

const Register = (): JSX.Element => {
  const [socialLoginCompleted, setSocialLoginCompleted] = React.useState(false);
  const password = useRef({});

  const dispatch = useAppDispatch();
  const { uiState, member: customer, error } = useAppSelector(selectCustomer);

  const { signup } = useAuth();

  const { logEvent } = useAnalytics();
  const loginWithGoogle = async () => {
    dispatch(setCustomerState({ uiState: IN_PROGRESS }));
    try {
      logEvent("signup_google_event");
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken
      );
      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      setSocialLoginCompleted(true);
      if (
        userCredential &&
        userCredential.user &&
        userCredential.user.displayName
      ) {
        let names = userCredential.user.displayName.split(" ");
        setValue("firstName", names[0] || "");
        setValue("lastName", names[1] || "");
      }
      setValue("email", userCredential.user.email || "");
      setValue("phone", "");
      // Sign-in the user with the credential
    } catch (error: any) {
      console.log("error", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        dispatch(
          setCustomerState({ uiState: FAILED, error: "Sign Up Cancelelled" })
        );
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        dispatch(
          setCustomerState({
            uiState: FAILED,
            error: "Google Play Service Not Available",
          })
        );
        // play services not available or outdated
      } else {
        dispatch(
          setCustomerState({
            uiState: FAILED,
            error: "Something went wrong!",
          })
        );
        // some other error happened
      }
    }
  };

  const loginWithApple = async () => {
    dispatch(setCustomerState({ uiState: IN_PROGRESS }));
    try {
      logEvent("signup_apple_event");
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.IMPLICIT,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        console.log("Apple Sign-In failed - no identify token returned");
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = auth.AppleAuthProvider.credential(
        identityToken,
        nonce
      );

      // Sign the user in with the credential
      const userCredential = await auth().signInWithCredential(appleCredential);

      if (!userCredential.user.email) {
        dispatch(
          setCustomerState({
            uiState: FAILED,
            error: "Please choose emailId in apple login",
          })
        );
        return;
      }

      setSocialLoginCompleted(true);
      if (
        userCredential &&
        userCredential.user &&
        userCredential.user.displayName
      ) {
        let names = userCredential.user.displayName.split(" ");
        setValue("firstName", names[0] || "");
        setValue("lastName", names[1] || "");
      }
      setValue("email", userCredential.user.email || "");
      setValue("phone", "");
    } catch (error) {
      console.log(error);
      dispatch(
        setCustomerState({
          uiState: FAILED,
          error: "Apple login failed!",
        })
      );
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty, errors },
    trigger,
  } = useForm<RegisterForm>({
    mode: "all",
    defaultValues: {
      firstName: SAMPLE.FIRST_NAME,
      lastName: SAMPLE.LAST_NAME,
      phone: SAMPLE.PHONE,
      email: SAMPLE.EMAIL,
      password: SAMPLE.PASSWORD,
      confirmPassword: SAMPLE.PASSWORD,
    },
  });

  password.current = watch("password", "");

  const registerCustomer = (payload: CustomerProfile) => {
    dispatch(registerCustomerAsync(payload))
      .then(async () => {
        popToPop("VerifyEmail");
      })
      .catch((err) => {
        dispatch(
          setCustomerState({
            uiState: FAILED,
            error:
              "Something went wrong while creating profile. Please try again.",
          })
        );
      });
  };

  const onSubmit = async (data: RegisterForm) => {
    await trigger();
    dispatch(
      setCustomerState({
        uiState: IN_PROGRESS,
      })
    );
    if (socialLoginCompleted) {
      let payload: CustomerProfile = {
        ...dummyProfile,
        ...data,
        phones: [
          {
            ...({} as Phone),
            number: data.phone,
          },
        ],
        customerId: data.email,
      };
      registerCustomer(payload);
      return;
    }
    logEvent("signup_email_event");

    signup(data)
      .then((payload) => {
        registerCustomer(payload);
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
    <AppSafeAreaView loading={uiState === IN_PROGRESS}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <Center width={"100%"}>
          {!socialLoginCompleted && (
            <Text color={AppColors.SECONDARY} fontSize={20} textAlign="center">
              Create an account {"\n"}to manage your service
            </Text>
          )}
          {socialLoginCompleted && (
            <Text color={AppColors.SECONDARY} fontSize={20} textAlign="center">
              Please provide the {"\n"}required information
            </Text>
          )}
        </Center>
        {/* <ScrollView> */}

        <Flex flexDirection={"column"} flex={1} paddingX={5} mt={10}>
          {uiState === FAILED && <ErrorView message={error} />}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                type="text"
                label="Firstname"
                onChange={onChange}
                value={value}
              />
            )}
            name="firstName"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                type="text"
                label="Lastname"
                onChange={onChange}
                value={value}
              />
            )}
            name="lastName"
          />
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, value } }) => (
              <AppInput
                type="number"
                label="Phone"
                onChange={onChange}
                value={value}
              />
            )}
            name="phone"
          />
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
                disabled={socialLoginCompleted}
              />
            )}
            name="email"
          />
          {!socialLoginCompleted && (
            <>
              <Controller
                control={control}
                rules={{
                  required: !socialLoginCompleted,
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
              <Controller
                control={control}
                rules={{
                  required: !socialLoginCompleted,
                  validate: (value) =>
                    value === password.current || "The passwords do not match",
                }}
                render={({ field: { onChange, value } }) => (
                  <AppInput
                    type="password"
                    label="Confirm Password"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="confirmPassword"
              />
              {errors.confirmPassword && (
                <Text fontSize={12} fontWeight={"semibold"} color={"red.500"}>
                  Password do not match
                </Text>
              )}
              <Button
                mt={5}
                height={50}
                disabled={!isValid}
                bg={AppColors.TEAL}
                _text={{ color: "white" }}
                onPress={handleSubmit(onSubmit)}
              >
                CREATE ACCOUNT
              </Button>
            </>
          )}

          <Spacer top={20} />
          {!socialLoginCompleted && (
            <SocialLogin
              label="Sign up"
              loginWithGoogle={loginWithGoogle}
              loginWithApple={loginWithApple}
            />
          )}
        </Flex>
        <Divider thickness={0} mt={200} />
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </AppSafeAreaView>
  );
};

export default Register;
