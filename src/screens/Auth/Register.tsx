import { Center, Divider, Flex, Text } from "native-base";
import React from "react";
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
import { useMutation } from "react-query";
import { postCustomer } from "../../services/customer";
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

const Register = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);
  const [socialLoginCompleted, setSocialLoginCompleted] = React.useState(false);
  const { signup } = useAuth();

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();

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
      console.log("apperror", error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setErrorMsg("Sign Up Cancelelled");
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setErrorMsg("Google Play Service Not Available");
        // play services not available or outdated
      } else {
        setErrorMsg("Something went wrong!");
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

      if (!appleAuthRequestResponse.email) {
        setErrorMsg("Please choose email id while chooce apple login");
        return;
      }

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
    formState: { isValid },
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
      onSuccess: async () => {
        await StorageHelper.setValue(
          FLAG_TYPE.ADDRESS_DETAILS_STATUS,
          STATUS.PENDING
        );
        setLoading(false);
        popToPop("Address");
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
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <Flex flexDirection={"column"} flex={1} paddingX={5} mt={10}>
          <ErrorView message={errorMsg} />
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
