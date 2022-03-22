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
import { AppColors } from "../../commons/colors";
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
  const { control, handleSubmit, formState, getValues, setError, trigger } =
    useForm<{
      email: string;
    }>({
      defaultValues: {
        email: "",
      },
      mode: "all",
    });

  React.useEffect(() => {
    setError("email", {}, { shouldFocus: true });
  }, []);

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
          <Divider thickness={0} mt={15} />
          <Center mt={10}>
            <AppButton
              color={AppColors.SECONDARY}
              label="RESET PASSWORD"
              onPress={async () => {
                await trigger();
                if (!formState.isValid) {
                  console.log("Reset Form Not Valid");
                  return;
                }
                onSumbit(getValues().email);
              }}
            />
          </Center>
        </ScrollView>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ForgetPassword;
