import { Button, Center, Divider, Flex, Text } from "native-base";
import React, { useEffect, useRef } from "react";
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
import { navigate, popToPop } from "../../navigations/rootNavigation";
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
import { FAILED, INIT, IN_PROGRESS, SUCCESS } from "../../commons/ui-states";
import { SAMPLE } from "../../commons/sample";
import GradientButton from "../../components/GradientButton";
import { useIsFocused } from "@react-navigation/native";

const Register = (): JSX.Element => {
  const socialLoginCompleted = React.useRef<boolean>(false);
  const password = useRef({});
  const [inviteBasedLogin, setInviteBasedLogin] =
    React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty, errors },
    getValues,
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

  const dispatch = useAppDispatch();
  const { uiState, member: customer, error } = useAppSelector(selectCustomer);

  const { signup } = useAuth();

  const { logEvent } = useAnalytics();

  const isFocussed = useIsFocused();

  const checkForInviteBasedLogin = React.useCallback(async () => {
    let email = await StorageHelper.getValue("INVITE_EMAIL");
    if (email) {
      setValue("email", email);
      setInviteBasedLogin(true);
    }
  }, []);

  useEffect(() => {
    if (isFocussed) {
      dispatch(setCustomerState({ uiState: INIT }));
      checkForInviteBasedLogin();
    }
  }, [isFocussed]);

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
      socialLoginCompleted.current = true;
      if (
        userCredential &&
        userCredential.user &&
        userCredential.user.displayName
      ) {
        let names = userCredential.user.displayName.split(" ");
        onSubmit({
          firstName: names[0],
          lastName: names[1],
          phone: "",
          email: userCredential.user.email || "",
          password: "",
          confirmPassword: "",
        });
        return;
      } else {
        dispatch(
          setCustomerState({
            uiState: FAILED,
            error: "Something went wrong!",
          })
        );
      }
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

      socialLoginCompleted.current = true;
      if (userCredential && userCredential.user) {
        onSubmit({
          firstName: appleAuthRequestResponse.fullName?.givenName || "",
          lastName: appleAuthRequestResponse.fullName?.familyName || "",
          phone: "",
          email: userCredential.user.email || "",
          password: "",
          confirmPassword: "",
        });
        return;
      } else {
        dispatch(
          setCustomerState({
            uiState: FAILED,
            error: "Something went wrong!",
          })
        );
      }
      setValue("email", userCredential.user.email || "");
      setValue("phone", "");

      dispatch(setCustomerState({ uiState: SUCCESS }));
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

  const registerCustomer = async (payload: CustomerProfile) => {
    dispatch(registerCustomerAsync({ ...payload }))
      .then(async () => {
        if (inviteBasedLogin) {
          await StorageHelper.removeValue("INVITE_EMAIL");
          await StorageHelper.removeValue("INVITE_RID");
          await StorageHelper.removeValue("INVITE_SACCOUNTID");
          await StorageHelper.removeValue("INVITE_ROLE");
        }
        if (socialLoginCompleted.current || inviteBasedLogin) {
          await StorageHelper.setValue(
            FLAG_TYPE.AUTHENTICATED_USER,
            STATUS.TRUE
          );
          popToPop("Dashboard");
        } else {
          popToPop("VerifyEmail");
        }
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
    // await trigger();
    dispatch(
      setCustomerState({
        uiState: IN_PROGRESS,
      })
    );
    let rid = null,
      role = null,
      sAccountId = null;
    if (inviteBasedLogin) {
      rid = await StorageHelper.getValue("INVITE_RID");
      sAccountId = await StorageHelper.getValue("INVITE_SACCOUNTID");
      role = await StorageHelper.getValue("INVITE_ROLE");
    }
    let fcmToken = await StorageHelper.getValue("FCM_DEVICE_TOKEN");
    let payload: CustomerProfile = {
      ...dummyProfile,
      ...data,
      fcmDeviceToken: fcmToken,
      phones: [
        {
          ...({} as Phone),
          number: data.phone,
        },
      ],
      rid: rid || null,
      role: role || null,
      sAccountId: sAccountId || "",
      customerId: data.email,
    };

    if (sAccountId) {
      data.sAccountId = sAccountId || "";
    }

    if (socialLoginCompleted.current) {
      registerCustomer(payload);
      return;
    }
    logEvent("signup_email_event");

    signup(data)
      .then((response) => {
        payload = {
          ...payload,
          uid: response.uid,
        };
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
    <AppSafeAreaView mt={60} loading={uiState === IN_PROGRESS}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <Center mt={"1/4"} width={"100%"}>
          <Text color={AppColors.SECONDARY} fontSize={20} textAlign="center">
            Create an account {"\n"}to manage your service
          </Text>
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
                label="First Name"
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
                label="Last Name"
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
                disabled={inviteBasedLogin}
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
          <Controller
            control={control}
            rules={{
              required: true,
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
          <Divider thickness={0} mt={18} />
          <GradientButton
            text="CREATE ACCOUNT"
            onPress={handleSubmit(onSubmit)}
          />
          {!inviteBasedLogin && (
            <>
              <Spacer top={20} />
              <SocialLogin
                label="Sign up"
                loginWithGoogle={loginWithGoogle}
                loginWithApple={loginWithApple}
              />
            </>
          )}
        </Flex>
        <Divider thickness={0} mt={200} />
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    </AppSafeAreaView>
  );
};

export default Register;
