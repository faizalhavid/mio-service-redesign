import {
  Box,
  Center,
  Divider,
  Flex,
  HStack,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { Platform } from "react-native";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import FooterButton from "../../components/FooterButton";
import SocialLoginButton from "../../components/SocialLoginButton";
import Spacer from "../../components/Spacer";
import auth from "@react-native-firebase/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import AppInput from "../../components/AppInput";
import appleAuth from "@invertase/react-native-apple-authentication";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { postCustomer } from "../../services/customer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { navigate, popToPop } from "../../navigations/rootNavigation";
import {
  CustomerProfile,
  dummyProfile,
  Phone,
  RegisterForm,
  useAuth,
} from "../../contexts/AuthContext";
import { ENV } from "../../commons/environment";
import SocialLogin from "../../components/SocialLogin";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Register = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [socialLoginCompleted, setSocialLoginCompleted] = React.useState(false);
  const { currentUser, signup, login, logout } = useAuth();

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      // const isSignedin = await GoogleSignin.isSignedIn();
      // console.log(isSignedin);
      // if (isSignedin) {
      //   // await logout();
      //   await GoogleSignin.signOut();
      //   return;
      // }
      // if (!isSignedin) {
      const userInfo = await GoogleSignin.signIn();
      console.log("userInfo", userInfo.user);

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
      console.log(error);
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

  const loginWithApple = async () => {
    setLoading(true);
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
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
      console.log("credential", userCredential);

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
    } finally {
      setLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<RegisterForm>({
    defaultValues: {
      // firstName: "T",
      // lastName: "K",
      // phone: "7845715615",
      // email: "kthilagarajan@gmail.com",
      // password: "test@123",
    },
    mode: "all",
  });

  const registerCustomerMutation = useMutation(
    "registerCustomer",
    (data: CustomerProfile) => {
      setLoading(true);
      console.log(data);
      return postCustomer(data);
    },
    {
      onSuccess: async (data) => {
        await AsyncStorage.setItem(
          "APP_START_STATUS",
          "UPDATE_ADDRESS_PENDING"
        );
        setLoading(false);
        popToPop("Address", { returnTo: "VerifyEmail" });
      },
      onError: (err) => {
        setLoading(false);
        setErrorMsg(
          "Something went wrong while creating profile. Please try again."
        );
        console.log(err);
      },
    }
  );

  const socialRegisterCustomerMutation = useMutation(
    "socialRegisterCustomer",
    (data: CustomerProfile) => {
      setLoading(true);
      return postCustomer(data);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        console.log("data", data);
        popToPop("Dashboard");
      },
      onError: (err) => {
        setLoading(false);
        setErrorMsg(
          "Something went wrong while creating profile. Please try again."
        );
        console.log(err);
      },
    }
  );

  const [errorMsg, setErrorMsg] = React.useState("");
  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
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
      registerCustomerMutation.mutate(payload);
      return;
    }
    setErrorMsg("");
    signup(data)
      .then((payload) => {
        registerCustomerMutation.mutate(payload);
      })
      .catch((error) => {
        setErrorMsg(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <AppSafeAreaView loading={loading}>
      <Center width={"100%"}>
        {!socialLoginCompleted && (
          <Text fontSize={20} textAlign="center">
            Create an account {"\n"}to manage your service
          </Text>
        )}
        {socialLoginCompleted && (
          <Text fontSize={20} textAlign="center">
            Please provide the {"\n"}required information
          </Text>
        )}
      </Center>
      {/* <ScrollView> */}
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <Flex flexDirection={"column"} flex={1} paddingX={5} mt={10}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
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
            render={({ field: { onChange, onBlur, value } }) => (
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
            render={({ field: { onChange, onBlur, value } }) => (
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
          {!socialLoginCompleted && (
            <Controller
              control={control}
              rules={{
                required: !socialLoginCompleted,
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
          )}

          {errorMsg.length > 0 && (
            <>
              <Spacer top={20} />
              <Center>
                <Text color={"red.500"} fontWeight="semibold">
                  {errorMsg}
                </Text>
              </Center>
            </>
          )}
          <Spacer top={20} />
          {!socialLoginCompleted && (
            <SocialLogin
              label="Signup"
              loginWithGoogle={loginWithGoogle}
              loginWithApple={loginWithApple}
            />
          )}
        </Flex>
        <Divider thickness={0} mt={200} />
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
      <FooterButton
        label={"CREATE ACCOUNT"}
        disabled={!isValid}
        subText="Provide provide the required fields"
        onPress={handleSubmit(onSubmit)}
      />
    </AppSafeAreaView>
  );
};

export default Register;
