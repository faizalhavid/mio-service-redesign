import {
  Actionsheet,
  Center,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Spacer,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import * as ImagePicker from "react-native-image-picker";
import { firebase } from "@react-native-firebase/storage";
import { Keyboard, Platform } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { AppColors } from "../../commons/colors";
import { Phone, useAuth } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCustomer, putCustomerAsync } from "../../slices/customer-slice";
import AppInput from "../AppInput";
import ErrorView from "../ErrorView";
import FooterButton from "../FooterButton";

type PersonalDetailsForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

type PersonalDetailsBottomSheetProps = {
  showPersonalDetails: boolean;
  setShowPersonalDetails: Function;
};

export function PersonalDetailsBottomSheet({
  showPersonalDetails,
  setShowPersonalDetails,
}: PersonalDetailsBottomSheetProps): JSX.Element {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [profileUrl, setProfileUrl] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState("");
  const { currentUser } = useAuth();

  const {
    uiState: customerUiState,
    member: customer,
    error: customerError,
  } = useAppSelector(selectCustomer);

  useEffect(() => {
    if (customer) {
      setValue("firstName", customer.firstName);
      setValue("lastName", customer.lastName);
      setValue("phone", customer.phones?.[0]?.number || "");
      setValue("email", customer.email);
      setProfileUrl(customer.pictureURL);
    }
  }, [customer]);

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<PersonalDetailsForm>({
    mode: "onChange",
  });

  const onSubmit = async (data: PersonalDetailsForm) => {
    Keyboard.dismiss();
    const formValues = getValues();
    dispatch(
      putCustomerAsync({
        ...customer,
        ...{
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          phones: [
            {
              ...({} as Phone),
              number: formValues.phone,
            },
          ],
        },
        pictureURL: profileUrl,
      })
    ).then(() => {
      setShowPersonalDetails(false);
    });
  };

  return (
    <Actionsheet
      isOpen={showPersonalDetails}
      onClose={() => setShowPersonalDetails(false)}
      hideDragIndicator
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
        <ScrollView width="100%">
          <VStack pt={15} bg="white" width="100%">
            <Center>
              <Text fontSize={18} fontWeight="semibold">
                Personal Details
              </Text>
            </Center>
            <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} />
            {/* <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              enabled
              keyboardVerticalOffset={Platform.select({
                ios: 80,
                android: 500,
              })}
            >
              <KeyboardAwareScrollView enableOnAndroid={true}> */}
            <VStack px={4} space={0} pb={75} bg={AppColors.EEE}>
              <ErrorView message={errorMsg} />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
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
                render={({ field: { onChange, onBlur, value } }) => (
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
                render={({ field: { onChange, onBlur, value } }) => (
                  <AppInput
                    type="email"
                    label="Email"
                    disabled
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
                    type="number"
                    label="Phone"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="phone"
              />

              <Text color="gray.400">Profile Photo</Text>
              <HStack mt={2} alignItems="center" space={2}>
                {loading && <Spinner size="sm" />}
                {!loading && Boolean(profileUrl) && profileUrl.length > 0 && (
                  <Image
                    source={{
                      width: 100,
                      height: 100,
                      uri: profileUrl,
                      cache: "force-cache",
                    }}
                    alt="Profile"
                    bg="gray.200"
                  />
                )}
                <Pressable
                  ml={0}
                  _pressed={{
                    backgroundColor: AppColors.LIGHT_TEAL,
                  }}
                  onPress={() => {
                    ImagePicker.launchImageLibrary(
                      {
                        mediaType: "photo",
                        includeBase64: false,
                        maxHeight: 200,
                        maxWidth: 200,
                      },
                      (response: any) => {
                        // console.log("Response = ", response);

                        if (response.didCancel) {
                          console.log("User cancelled image picker");
                        } else if (response.error) {
                          console.log("ImagePicker Error: ", response.error);
                        } else {
                          setLoading(true);
                          const { fileName, uri } = response.assets[0];
                          const imageRef = `users/${currentUser.uid}/profile.${
                            fileName.split(".")[1]
                          }`;
                          firebase
                            .storage()
                            .ref(imageRef)
                            .putFile(uri)
                            .then(async (snapshot) => {
                              const imageDownload = firebase
                                .storage()
                                .ref(imageRef);
                              const url = await imageDownload.getDownloadURL();
                              setProfileUrl(url);
                              setLoading(false);
                            })
                            .catch(() => {
                              setLoading(false);
                            });
                        }
                      }
                    );
                  }}
                >
                  <Text color={AppColors.DARK_TEAL}>
                    {profileUrl
                      ? "Change Profile Picture"
                      : "Choose Profile Picture"}
                  </Text>
                </Pressable>
              </HStack>
            </VStack>
            {/* </KeyboardAwareScrollView>
            </KeyboardAvoidingView> */}
          </VStack>
          {Platform.OS === "ios" && <KeyboardSpacer />}
        </ScrollView>
        <FooterButton
          disabled={!isValid || loading}
          loading={customerUiState === "IN_PROGRESS"}
          minLabel="SAVE"
          maxLabel="PERSONAL DETAILS"
          type="DEFAULT"
          onPress={handleSubmit(onSubmit)}
        />
      </Actionsheet.Content>
    </Actionsheet>
  );
}
