import {
  Center,
  Divider,
  Flex,
  Input,
  StatusBar,
  Text,
  VStack,
} from "native-base";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform } from "react-native";
import { useMutation } from "react-query";
import { AppColors } from "../../commons/colors";
import AppButton from "../../components/AppButton";
import AppInput from "../../components/AppInput";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import Spacer from "../../components/Spacer";
import { useAuth } from "../../contexts/AuthContext";
import { navigate, popToPop } from "../../navigations/rootNavigation";

type LoginFormType = {
  email: string;
  password: string;
};

const Login = (): JSX.Element => {
  const [loading, setLoading] = React.useState(false);

  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<LoginFormType>({
    defaultValues: {
      email: "kthilagarajan@gmail.com",
      password: "test@123",
    },
    mode: "onChange",
  });

  const [errorMsg, setErrorMsg] = React.useState("");
  const onSubmit = async (data: LoginFormType) => {
    setLoading(true);
    setErrorMsg("");
    login(data.email, data.password)
      .then((status) => {
        switch (status) {
          case "NEW_USER":
            navigate("Register");
            break;
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
      <Flex mt={100} flexDirection={"column"} flex={1} paddingX={5}>
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
                lineWidth={1}
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
        <VStack
          space="1"
          position={"absolute"}
          bottom={10}
          alignSelf={"center"}
        >
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
        </VStack>
      </Flex>
    </AppSafeAreaView>
  );
};

export default Login;
