import {
  Actionsheet,
  VStack,
  Center,
  Spacer,
  ScrollView,
  Text,
  Select,
} from "native-base";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard } from "react-native";
import { AppColors } from "../../commons/colors";
import { ROLES } from "../../commons/options";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCustomer } from "../../slices/customer-slice";
import {
  getInvitedUsersAsync,
  inviteUserAsync,
  selectInviteNewUser,
} from "../../slices/invite-slice";
import AppInput from "../AppInput";
import ErrorView from "../ErrorView";
import FooterButton from "../FooterButton";

type InviteBottomSheetProps = {
  showInviteUser: boolean;
  setShowInviteUser: Function;
};

type InviteUserForm = {
  email: string;
  role: string;
};

const InviteBottomSheet = ({
  showInviteUser,
  setShowInviteUser,
}: InviteBottomSheetProps): JSX.Element => {
  const dispatch = useAppDispatch();
  const [errorMsg, setErrorMsg] = useState("");

  const { member: customer } = useAppSelector(selectCustomer);
  const {
    member: inviteNewUser,
    uiState: inviteNewUserUiState,
    error: inviteNewUserError,
  } = useAppSelector(selectInviteNewUser);
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors, isValid },
  } = useForm<InviteUserForm>({
    mode: "onChange",
    defaultValues: {
      email: "",
      role: "Viewer",
    },
  });

  const onSubmit = async () => {
    Keyboard.dismiss();
    let data = getValues();
    await dispatch(
      inviteUserAsync({
        customerId: customer.customerId,
        inviterEmail: data.email,
        claim: data.role,
        sAccountId: customer.sAccountId,
        email: customer.customerId,
      })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        setShowInviteUser(false);
        dispatch(
          getInvitedUsersAsync({ serviceAccountId: customer.sAccountId })
        );
        reset();
      }
    });
  };
  return (
    <Actionsheet
      isOpen={showInviteUser}
      onClose={() => setShowInviteUser(false)}
      hideDragIndicator={true}
    >
      <Actionsheet.Content
        style={{
          borderTopLeftRadius: 3,
          borderTopRightRadius: 3,
          paddingTop: 0,
          paddingLeft: 0,
          paddingRight: 0,
          margin: 0,
          backgroundColor: AppColors.EEE,
        }}
      >
        <ScrollView width={"100%"}>
          <VStack pt={15} bg={"white"} width="100%">
            <Center>
              <Text fontSize={18} fontWeight="semibold">
                Invite User
              </Text>
            </Center>
            <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} />

            <VStack px={4} space={0} pb={75} bg={AppColors.EEE}>
              <ErrorView message={inviteNewUserError?.error} />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    type="text"
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
                  <>
                    {value ? (
                      <Text mt={2} color={"gray.400"} fontSize={14}>
                        Role
                      </Text>
                    ) : (
                      <></>
                    )}
                    <Select
                      accessibilityLabel="ROLE"
                      placeholder="Role"
                      borderBottomWidth={1}
                      borderLeftWidth={0}
                      borderRightWidth={0}
                      borderTopWidth={0}
                      borderBottomColor={"#ccc"}
                      _selectedItem={{
                        bg: AppColors.PRIMARY,
                        // endIcon: <CheckIcon size="5" />,
                      }}
                      _important={{
                        color: AppColors.SECONDARY,
                      }}
                      textDecorationColor={AppColors.SECONDARY}
                      pl={-10}
                      pt={value ? 6 : 0}
                      mt={value ? -3 : 2}
                      fontSize={14}
                      variant="underlined"
                      onValueChange={onChange}
                      selectedValue={value}
                    >
                      {ROLES.map((role) => {
                        return (
                          <Select.Item
                            pl={3}
                            key={role.code}
                            label={role.label}
                            value={role.code}
                          />
                        );
                      })}
                    </Select>
                  </>
                )}
                name="role"
              />
            </VStack>
          </VStack>
        </ScrollView>
        <FooterButton
          disabled={!isValid}
          loading={inviteNewUserUiState === "IN_PROGRESS"}
          minLabel="INVITE"
          maxLabel={"NEW USER"}
          type="DEFAULT"
          onPress={handleSubmit(onSubmit)}
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default InviteBottomSheet;
