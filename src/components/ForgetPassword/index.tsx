import {
  Actionsheet,
  Button,
  Center,
  Divider,
  ScrollView,
  Text,
} from "native-base";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Platform } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { AppColors } from "../../commons/colors";
import { EMAIL_PATTERN } from "../../commons/patterns";
import AppButton from "../AppButton";
import AppInput from "../AppInput";

type ForgetPasswordProps = {
  showForgetPasswordForm: boolean;
  setShowForgetPasswordForm: Function;
  onSumbit: (email: string) => void;
};

const ForgetPassword = ({
  showForgetPasswordForm,
  setShowForgetPasswordForm,
  onSumbit,
}: ForgetPasswordProps): JSX.Element => {
  const { control, formState, getValues } = useForm<{
    email: string;
  }>({
    defaultValues: {
      email: "",
    },
    mode: "all",
  });

  return (
    <Actionsheet
      isOpen={showForgetPasswordForm}
      onClose={() => setShowForgetPasswordForm(false)}
    >
      <Actionsheet.Content>
        <ScrollView pt={5} pb={10} width={"90%"}>
          <Center mb={10}>
            <Text fontSize={20} color={AppColors.SECONDARY}>
              Reset Password
            </Text>
          </Center>
          <Controller
            key={"email"}
            control={control}
            rules={{
              required: true,
              pattern: {
                message: "Provide valid email id",
                value: EMAIL_PATTERN,
              },
            }}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <AppInput
                type="email"
                label="Email"
                onChange={onChange}
                value={value}
                error={errors?.email?.message}
              />
            )}
            name="email"
          />
          <Divider thickness={0} mt={15} />
          <Center mt={10}>
            <AppButton
              disabled={!formState.isValid}
              color={AppColors.SECONDARY}
              label={`RESET PASSWORD`}
              onPress={async () => {
                if (!formState.isValid) {
                  console.log("Reset Form Not Valid");
                  return;
                }
                onSumbit(getValues().email);
              }}
            />
          </Center>
          {Platform.OS === "ios" && <KeyboardSpacer />}
        </ScrollView>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ForgetPassword;
