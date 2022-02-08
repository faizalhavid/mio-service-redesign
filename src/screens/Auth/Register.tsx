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
  RegisterForm,
  useAuth,
} from "../../contexts/AuthContext";

const Register = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const { currentUser, signup, login } = useAuth();

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
        const userCredential = await auth().signInWithCredential(
          googleCredential
        );
        await AsyncStorage.setItem(
          "idToken",
          await userCredential.user.getIdToken()
        );
        await AsyncStorage.setItem("customerId", currentUser?.email || "");
        socialRegisterCustomerMutation.mutate({
          ...dummyProfile,
          firstName: currentUser?.displayName || "",
          email: currentUser?.email || "",
        });
        console.log(userCredential);
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
      const credential = await auth().signInWithCredential(appleCredential);
      console.log(credential);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<RegisterForm>({
    defaultValues: {
      firstName: "T",
      lastName: "K",
      phone: "7845715615",
      email: "kthilagarajan@gmail.com",
      password: "test@123",
    },
    mode: "onChange",
  });

  const registerCustomerMutation = useMutation(
    "registerCustomer",
    (data: CustomerProfile) => {
      setLoading(true);
      return postCustomer(data);
    },
    {
      onSuccess: (data) => {
        setLoading(false);
        console.log("data", data);
        popToPop("VerifyEmail");
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

  // const loginWithEmailPassword = async () => {
  //   const signIn = await auth().signInWithEmailAndPassword(control)
  //   console.log(signIn)
  // }

  return (
    <AppSafeAreaView loading={loading}>
      <Center width={"100%"}>
        <Text fontSize={20}>Create an account</Text>
        <Text fontSize={20}>to manage your service</Text>
      </Center>
      <ScrollView>
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
                lineWidth={1}
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
                lineWidth={1}
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
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                type="password"
                label="Password"
                lineWidth={1}
                onChange={onChange}
                value={value}
              />
            )}
            name="password"
          />
          <Spacer top={20} />
          {errorMsg.length > 0 && (
            <Center>
              <Text color={"red.500"} fontWeight="semibold">
                {errorMsg}
              </Text>
            </Center>
          )}

          <Spacer top={40} />
          {Platform.OS === "android" && (
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
          )}
          <Spacer top={40} />
          <VStack justifyContent={"center"} space={2} width={"100%"}>
            {Platform.OS === "android" && (
              <SocialLoginButton type="Google" onPress={loginWithGoogle} />
            )}
            {/* <SocialLoginButton type="Facebook" onPress={() => {}} /> */}
            {/* <SocialLoginButton type="Apple" onPress={loginWithApple} /> */}
          </VStack>
        </Flex>
        <Divider thickness={0} mt={150} />
      </ScrollView>
      <FooterButton
        label={"CREATE ACCOUNT"}
        disabled={!isValid}
        subText="Provide address in next step"
        onPress={handleSubmit(onSubmit)}
      />
    </AppSafeAreaView>
  );
};

export default Register;
