import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Center,
  Checkbox,
  Divider,
  HStack,
  Pressable,
  ScrollView,
  Spinner,
  Text,
  VStack,
} from "native-base";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dimensions, Keyboard, Platform } from "react-native";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { AppColors } from "../../commons/colors";
import { POOL_TYPES } from "../../commons/options";
import { Option, PriceMap, HouseInfoAddressRequest } from "../../commons/types";
import { FAILED } from "../../commons/ui-states";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import ErrorView from "../../components/ErrorView";
import FooterButton from "../../components/FooterButton";
import GoogleMapsInput from "../../components/GoogleMapsInput";
import { Address } from "../../contexts/AuthContext";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import { SuperRootStackParamList } from "../../navigations";
import { goBack, replace } from "../../navigations/rootNavigation";
import { StorageHelper } from "../../services/storage-helper";
import {
  selectCustomer,
  selectAddress,
  selectHouseInfo,
  updateAddressAsync,
  getCustomerByIdAsync,
  getHouseInfoAsync,
} from "../../slices/customer-slice";
import { selectLead, updateLeadState } from "../../slices/lead-slice";
import { selectServices } from "../../slices/service-slice";
import { LAWN_CARE_ID } from "./ChooseService";

export type BathBedOptions = { number: number; selected: boolean };
interface SelectOption extends Option {
  selected: boolean;
}

type EditAddressProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "EditAddress"
>;

const EditAddress = ({ route }: EditAddressProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const { returnTo, mode, id } = route.params;

  const screenWidth = Dimensions.get("screen").width;
  const [selectedArea, setSelectedArea] = React.useState<number>(0);
  const [selectedBathroomNo, setSelectedBathroomNo] = React.useState<number>(0);
  const [selectedBedroomNo, setSelectedBedroomNo] = React.useState<number>(0);
  const [areaOptions, setAreaOptions] = React.useState<PriceMap[]>([]);
  const [primary, setPrimary] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    {} as Address
  );

  const [bathroomOptions, setBathroomOptions] = React.useState<
    BathBedOptions[]
  >([]);
  const [bedroomOptions, setBedroomOptions] = React.useState<BathBedOptions[]>(
    []
  );

  const [poolTypeOptions, setPoolTypeOptions] = React.useState<SelectOption[]>(
    []
  );

  const [selectedPoolType, setSelectedPoolType] = useState<string>("");

  const { uiState: customerUiState, member: customer } =
    useAppSelector(selectCustomer);
  const { uiState: addressesUiState } = useAppSelector(selectAddress);

  const { collection: allServices } = useAppSelector(selectServices);

  const { uiState: houseInfoUiState } = useAppSelector(selectHouseInfo);
  const {
    member: leadDetails,
    uiState: leadDetailsUiState,
    uiState: leadUiState,
  } = useAppSelector(selectLead);
  const isAuthenticated = useAuthenticatedUser();

  useEffect(() => {
    if (selectedAddress && selectedAddress?.zip) {
      setValue("street", selectedAddress.street);
      setValue("city", selectedAddress.city);
      setValue("state", selectedAddress.state);
      setValue("zip", selectedAddress.zip);
      setPrimary(
        selectedAddress.isPrimary !== undefined
          ? selectedAddress.isPrimary
          : true
      );
    }
  }, [dispatch, mode, selectedAddress]);

  useEffect(() => {
    if (customer?.customerId && mode === "UPDATE_ADDRESS" && id) {
      let address = customer.addresses.filter((a) => a.googlePlaceId === id)[0];
      setSelectedAddress(address);
      setAddressSelectedFromPopup(address);
    }
  }, [customer, mode, id]);

  useEffect(() => {
    if (allServices.length > 0) {
      try {
        let hasArea = false;
        for (const service of allServices) {
          if (service.serviceId === LAWN_CARE_ID) {
            let priceMap: PriceMap[] = [];
            let lotsize: number = selectedAddress?.houseInfo?.lotSize || 0;
            for (const price of service.priceMap) {
              if (
                lotsize &&
                price.rangeMin !== undefined &&
                price.rangeMin !== null &&
                lotsize >= price.rangeMin &&
                price.rangeMax !== undefined &&
                price.rangeMax !== null &&
                lotsize <= price.rangeMax
              ) {
                hasArea = true;
                setSelectedArea(lotsize);
                priceMap.push({
                  ...price,
                  selected: hasArea,
                });
              } else {
                priceMap.push(price);
              }
            }
            setAreaOptions(
              priceMap.filter((price) => price.plan === "STANDARD")
            );

            break;
          }
        }
        setBathroomOptions([]);
        setBedroomOptions([]);
        let houseInfo = selectedAddress?.houseInfo;
        // console.log(houseInfo);
        let bathOptions: BathBedOptions[] = [];
        let bedOptions: BathBedOptions[] = [];
        for (let i of [1, 2, 3, 4, 5]) {
          let _bathRoomNo: number =
            houseInfo && houseInfo?.bathrooms && houseInfo?.bathrooms === i
              ? houseInfo?.bathrooms
              : 0;
          if (_bathRoomNo === i) {
            setSelectedBathroomNo(_bathRoomNo);
          }
          bathOptions.push({
            number: i,
            selected: _bathRoomNo === i,
          });

          let _bedRoomNo: number =
            houseInfo && houseInfo?.bedrooms && houseInfo?.bedrooms === i
              ? houseInfo?.bedrooms
              : 0;
          if (_bedRoomNo === i) {
            setSelectedBedroomNo(_bedRoomNo);
          }
          bedOptions.push({
            number: i,
            selected: _bedRoomNo === i,
          });
        }
        setBathroomOptions(bathOptions);
        setBedroomOptions(bedOptions);
      } catch (error) {
        console.log(error);
      }
      let poolTypes: SelectOption[] = [];
      for (let poolType of POOL_TYPES) {
        let selected =
          selectedAddress?.houseInfo?.swimmingPoolType === poolType.code;
        poolTypes.push({
          ...poolType,
          selected,
        });
        if (selected) {
          setSelectedPoolType(poolType.code);
        }
      }
      setPoolTypeOptions(poolTypes);
    }
  }, [selectedAddress, allServices]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
  } = useForm<HouseInfoAddressRequest>({
    mode: "onChange",
    // defaultValues: {
    //   street: SAMPLE.STREET,
    //   city: SAMPLE.CITY,
    //   state: SAMPLE.STATE,
    //   zip: SAMPLE.ZIP,
    // },
  });

  const onSubmit = async (data: HouseInfoAddressRequest) => {
    Keyboard.dismiss();
    // let fcmToken = await StorageHelper.getValue("FCM_DEVICE_TOKEN");
    let payload = {
      ...data,
      googlePlaceId:
        mode === "NEW_ADDRESS" ? undefined : selectedAddress?.googlePlaceId,
      houseInfo: {
        lotSize: selectedArea,
        bedrooms: selectedBedroomNo,
        bathrooms: selectedBathroomNo,
        swimmingPoolType: selectedPoolType,
      },
      isPrimary: primary,
    };
    if (isAuthenticated) {
      await dispatch(
        updateAddressAsync({
          ...payload,
          serviceAccountId: customer.sAccountId,
        })
      ).then(() => {
        dispatch(getCustomerByIdAsync(customer.customerId));
        _onClose();
      });
    } else {
      await StorageHelper.setValue("LOCAL_ADDRESS", JSON.stringify(payload));
      _onClose();
    }
  };

  const _onClose = () => {
    // setSelectedArea(0);
    // setSelectedBedroomNo(0);
    // setSelectedBathroomNo(0);
    // setSelectedPoolType("");
    if (setSelectedAddress) {
      setSelectedAddress({} as Address);
    }
    if (returnTo === "Profile") {
      goBack();
    } else {
      replace(returnTo);
    }
  };

  const [addressSelectedFromPopup, setAddressSelectedFromPopup] = useState<any>(
    {}
  );
  return (
    <AppSafeAreaView>
      <VStack bg={"white"} mt={"1/6"} height="100%" width="100%">
        <Center>
          <Text fontSize={18} fontWeight="semibold">
            Property Information
          </Text>
        </Center>
        {!addressSelectedFromPopup?.zip && (
          <VStack height="100%" px={3}>
            <Text
              fontSize={14}
              fontWeight={"semibold"}
              width={"100%"}
              color={AppColors.SECONDARY}
              mt={3}
            >
              Address
            </Text>
            <GoogleMapsInput
              onSuccess={(address) => {
                console.log("selected-address", address);
                setAddressSelectedFromPopup(address);
                dispatch(getHouseInfoAsync({ nva: address.formattedAddress }))
                  .unwrap()
                  .then((response) => {
                    if (response) {
                      let address: Address = response;
                      setSelectedAddress(address);
                      dispatch(
                        updateLeadState({
                          lead: {
                            ...leadDetails,
                            customerProfile: {
                              ...leadDetails.customerProfile,
                              addresses: [response],
                            },
                          },
                        })
                      );
                    }
                  });
              }}
              onFailure={() => {}}
            />
          </VStack>
        )}
        {houseInfoUiState !== "IN_PROGRESS" && addressSelectedFromPopup?.zip ? (
          <ScrollView>
            <>
              <VStack px={4} key="SELECTED_ADDRESS">
                <HStack justifyContent={"space-between"} alignItems="center">
                  <Text
                    fontSize={14}
                    fontWeight={"semibold"}
                    color={AppColors.SECONDARY}
                    mt={3}
                  >
                    Selected Address
                  </Text>
                  <Text
                    color={AppColors.TEAL}
                    fontWeight={"semibold"}
                    fontSize={12}
                    onPress={() => {
                      setAddressSelectedFromPopup({});
                    }}
                  >
                    CHANGE
                  </Text>
                </HStack>
                <Text
                  fontSize={14}
                  fontWeight={"semibold"}
                  color={AppColors.DARK_TEAL}
                  width={"100%"}
                  mt={2}
                >
                  {addressSelectedFromPopup?.formattedAddress}
                </Text>
              </VStack>
              <VStack key={"ADDRESS_SHEET"} px={4} space={0} pb={75}>
                {(customerUiState === FAILED ||
                  houseInfoUiState === FAILED) && (
                  <ErrorView
                    message={
                      "Something went wrong while updating address. Please try again."
                    }
                  />
                )}

                <Text
                  fontSize={14}
                  fontWeight={"semibold"}
                  width={"100%"}
                  color={AppColors.SECONDARY}
                  mt={3}
                >
                  Choose Lawn Size (Sq Ft)
                </Text>

                <HStack
                  space={2}
                  maxWidth={screenWidth}
                  flexWrap={"wrap"}
                  flexDirection="row"
                >
                  {areaOptions.map((areaOption, index) => (
                    <Pressable
                      key={index}
                      height={10}
                      borderRadius={5}
                      width={"45%"}
                      mt={2}
                      justifyContent="center"
                      borderWidth={1}
                      borderColor={
                        areaOption.selected ? AppColors.TEAL : AppColors.CCC
                      }
                      bg={areaOption.selected ? AppColors.LIGHT_TEAL : "#fff"}
                      _pressed={{
                        borderColor: AppColors.TEAL,
                        borderWidth: 1,
                        backgroundColor: AppColors.LIGHT_TEAL,
                      }}
                      onPress={() => {
                        let updatedList = areaOptions.map((pm2, index2) => {
                          if (index == index2) {
                            if (pm2.rangeMax) {
                              setSelectedArea(pm2.rangeMax);
                            }
                            let selected: PriceMap = {
                              ...pm2,
                              selected: true,
                            };
                            return selected;
                          }
                          return { ...pm2, selected: false };
                        });
                        setAreaOptions(updatedList);
                      }}
                    >
                      <Text
                        alignSelf={"center"}
                        color={AppColors.TEAL}
                        fontWeight={"semibold"}
                      >
                        {areaOption.rangeMin} - {areaOption.rangeMax}
                      </Text>
                    </Pressable>
                  ))}
                </HStack>
                <Text
                  fontSize={14}
                  fontWeight={"semibold"}
                  width={"100%"}
                  color={AppColors.SECONDARY}
                  mt={3}
                >
                  Choose no. of bedrooms
                </Text>
                <HStack
                  space={2}
                  maxWidth={screenWidth}
                  flexWrap={"wrap"}
                  flexDirection="row"
                >
                  {bedroomOptions.map((option, index) => (
                    <Pressable
                      key={index}
                      height={10}
                      borderRadius={5}
                      width={"13%"}
                      mt={2}
                      justifyContent="center"
                      borderWidth={1}
                      borderColor={
                        option.selected ? AppColors.TEAL : AppColors.CCC
                      }
                      bg={option.selected ? AppColors.LIGHT_TEAL : "#fff"}
                      _pressed={{
                        borderColor: AppColors.TEAL,
                        borderWidth: 1,
                        backgroundColor: AppColors.LIGHT_TEAL,
                      }}
                      onPress={() => {
                        let updatedOptions = bedroomOptions.map((opt, i) => {
                          if (i === index) {
                            setSelectedBedroomNo(option.number);
                            return {
                              ...opt,
                              selected: true,
                            };
                          }
                          return {
                            ...opt,
                            selected: false,
                          };
                        });
                        setBedroomOptions(updatedOptions);
                      }}
                    >
                      <Text
                        alignSelf={"center"}
                        color={AppColors.TEAL}
                        fontWeight={"semibold"}
                      >
                        {option.number}
                      </Text>
                    </Pressable>
                  ))}
                </HStack>
                <Text
                  fontSize={14}
                  fontWeight={"semibold"}
                  width={"100%"}
                  color={AppColors.SECONDARY}
                  mt={3}
                >
                  Choose no. of bathrooms
                </Text>
                <HStack
                  space={2}
                  maxWidth={screenWidth}
                  flexWrap={"wrap"}
                  flexDirection="row"
                >
                  {bathroomOptions.map((option, index) => (
                    <Pressable
                      key={index}
                      height={10}
                      borderRadius={5}
                      width={"13%"}
                      mt={2}
                      justifyContent="center"
                      borderWidth={1}
                      borderColor={
                        option.selected ? AppColors.TEAL : AppColors.CCC
                      }
                      bg={option.selected ? AppColors.LIGHT_TEAL : "#fff"}
                      _pressed={{
                        borderColor: AppColors.TEAL,
                        borderWidth: 1,
                        backgroundColor: AppColors.LIGHT_TEAL,
                      }}
                      onPress={() => {
                        let updatedOptions = bedroomOptions.map((opt, i) => {
                          if (i === index) {
                            setSelectedBathroomNo(option.number);
                            return {
                              ...opt,
                              selected: true,
                            };
                          }
                          return {
                            ...opt,
                            selected: false,
                          };
                        });
                        setBathroomOptions(updatedOptions);
                      }}
                    >
                      <Text
                        alignSelf={"center"}
                        color={AppColors.TEAL}
                        fontWeight={"semibold"}
                      >
                        {option.number}
                      </Text>
                    </Pressable>
                  ))}
                </HStack>
                <Text
                  fontSize={14}
                  fontWeight={"semibold"}
                  width={"100%"}
                  color={AppColors.SECONDARY}
                  mt={3}
                >
                  Choose Pool Type
                </Text>
                <HStack
                  space={2}
                  maxWidth={screenWidth}
                  flexWrap={"wrap"}
                  flexDirection="row"
                >
                  {poolTypeOptions.map((poolType, index) => (
                    <Pressable
                      key={index}
                      height={10}
                      borderRadius={5}
                      width={"30%"}
                      mt={2}
                      justifyContent="center"
                      borderWidth={1}
                      borderColor={
                        poolType.selected ? AppColors.TEAL : AppColors.CCC
                      }
                      bg={poolType.selected ? AppColors.LIGHT_TEAL : "#fff"}
                      _pressed={{
                        borderColor: AppColors.TEAL,
                        borderWidth: 1,
                        backgroundColor: AppColors.LIGHT_TEAL,
                      }}
                      onPress={() => {
                        let updatedList = poolTypeOptions.map((pm2, index2) => {
                          if (index == index2) {
                            let selected: SelectOption = {
                              ...pm2,
                              selected: true,
                            };
                            setSelectedPoolType(pm2.code);
                            return selected;
                          }
                          return { ...pm2, selected: false };
                        });
                        setPoolTypeOptions(updatedList);
                      }}
                    >
                      <Text
                        alignSelf={"center"}
                        color={AppColors.TEAL}
                        fontWeight={"semibold"}
                      >
                        {poolType.label}
                      </Text>
                    </Pressable>
                  ))}
                </HStack>
                <Checkbox
                  value="primary"
                  mt={4}
                  ml={1}
                  _text={{
                    color: AppColors.DARK_TEAL,
                    fontSize: 14,
                    fontWeight: "semibold",
                    padding: 0,
                  }}
                  _stack={{ space: 0 }}
                  _checked={{
                    borderColor: AppColors.TEAL,
                    backgroundColor: AppColors.TEAL,
                  }}
                  style={{
                    borderWidth: 1,
                    borderColor: AppColors.TEAL,
                  }}
                  isChecked={primary}
                  onChange={(value) => {
                    setPrimary(value);
                  }}
                >
                  Set as primary
                </Checkbox>
                <Divider mt={20} thickness={0} />
              </VStack>
            </>
          </ScrollView>
        ) : (
          <>
            {houseInfoUiState === "IN_PROGRESS" && (
              <Center key={"LOADING"}>
                <Spinner my={5} size="sm" color={AppColors.SECONDARY} />
                <Text color={AppColors.SECONDARY}>Getting house info...</Text>
              </Center>
            )}
          </>
        )}
        {/* <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} /> */}
        {/* <KeyboardAwareScrollView
              enableOnAndroid={true}
              style={{
                padding: 0,
                margin: 0,
              }}
            > */}
        {/* <ScrollView width={"100%"}> */}

        {Platform.OS === "ios" && <KeyboardSpacer />}
        {/* </ScrollView> */}
        {/* </KeyboardAwareScrollView> */}
      </VStack>

      <FooterButton
        disabled={
          (!isValid && isDirty) ||
          // !isDirty ||
          !selectedArea ||
          !selectedBathroomNo ||
          !selectedBedroomNo ||
          !selectedPoolType
        }
        loading={
          customerUiState === "IN_PROGRESS" ||
          addressesUiState === "IN_PROGRESS"
        }
        minLabel="SAVE"
        maxLabel={"ADDRESS"}
        type="ADDRESS"
        onPress={handleSubmit(onSubmit)}
      />
    </AppSafeAreaView>
  );
};

export default EditAddress;
