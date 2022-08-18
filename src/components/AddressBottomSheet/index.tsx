import {
  Actionsheet,
  Center,
  Divider,
  Text,
  Select,
  VStack,
  Spacer,
  HStack,
  Pressable,
  ScrollView,
  Checkbox,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, Keyboard, Platform } from "react-native";
import { AppColors } from "../../commons/colors";
import { STATES } from "../../commons/dropdown-values";
import { POOL_TYPES } from "../../commons/options";
import { SAMPLE } from "../../commons/sample";
import { HouseInfoAddressRequest, Option, PriceMap } from "../../commons/types";
import { FAILED } from "../../commons/ui-states";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { LAWN_CARE_ID } from "../../screens/Home/ChooseService";
import {
  selectCustomer,
  selectHouseInfo,
  updateAddressAsync,
  getCustomerByIdAsync,
  selectAddress,
} from "../../slices/customer-slice";
import { selectServices } from "../../slices/service-slice";
import AppInput from "../AppInput";
import ErrorView from "../ErrorView";
import FooterButton from "../FooterButton";
import KeyboardSpacer from "react-native-keyboard-spacer";
import { Address } from "../../contexts/AuthContext";

type UPDATE_ADDRESS = "UPDATE_ADDRESS";
type NEW_ADDRESS = "NEW_ADDRESS";

export type AddressMode = NEW_ADDRESS | UPDATE_ADDRESS;
export type BathBedOptions = { number: number; selected: boolean };
interface SelectOption extends Option {
  selected: boolean;
}

type AddressBottomSheetProps = {
  selectedAddress?: Address;
  setSelectedAddress?: Function;
  showEditAddress: boolean;
  setShowEditAddress: Function;
  mode: AddressMode;
  hideAfterSave?: boolean;
};

export const AddressBottomSheet = ({
  selectedAddress,
  setSelectedAddress,
  showEditAddress,
  setShowEditAddress,
  mode,
  hideAfterSave,
}: AddressBottomSheetProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const screenWidth = Dimensions.get("screen").width;
  const [currentMode, setCurrentMode] = useState<AddressMode>(mode);
  const [selectedArea, setSelectedArea] = React.useState<number>(0);
  const [selectedBathroomNo, setSelectedBathroomNo] = React.useState<number>(0);
  const [selectedBedroomNo, setSelectedBedroomNo] = React.useState<number>(0);
  const [areaOptions, setAreaOptions] = React.useState<PriceMap[]>([]);
  const [primary, setPrimary] = useState<boolean>(false);

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

  useEffect(() => {
    if (
      showEditAddress &&
      mode === "UPDATE_ADDRESS" &&
      selectedAddress &&
      selectedAddress?.zip
    ) {
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
  }, [dispatch, showEditAddress, mode, selectedAddress, customer]);

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
  }, [currentMode, allServices]);

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
    await dispatch(
      updateAddressAsync({
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
        serviceAccountId: customer.sAccountId,
      })
    ).then(() => {
      dispatch(getCustomerByIdAsync(customer.customerId));
      _onClose();
    });
  };

  const _onClose = () => {
    // setSelectedArea(0);
    // setSelectedBedroomNo(0);
    // setSelectedBathroomNo(0);
    // setSelectedPoolType("");
    if (setSelectedAddress) {
      setSelectedAddress({} as Address);
    }
    setShowEditAddress(false);
  };

  return (
    <Actionsheet
      isOpen={showEditAddress}
      onClose={_onClose}
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
        <VStack pt={15} bg={"white"} width="100%">
          <Center>
            <Text fontSize={18} fontWeight="semibold">
              Address Details
            </Text>
          </Center>

          <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} />
          {/* <KeyboardAwareScrollView
              enableOnAndroid={true}
              style={{
                padding: 0,
                margin: 0,
              }}
            > */}
          <ScrollView width={"100%"}>
            <VStack
              key={"ADDRESS_SHEET"}
              px={4}
              space={0}
              pb={75}
              bg={AppColors.EEE}
            >
              {(customerUiState === FAILED || houseInfoUiState === FAILED) && (
                <ErrorView
                  message={
                    "Something went wrong while updating address. Please try again."
                  }
                />
              )}
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <AppInput
                    type="text"
                    label="Street"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="street"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <AppInput
                    type="text"
                    label="City"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="city"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <>
                    {value ? (
                      <Text mt={2} color={"gray.400"} fontSize={14}>
                        State
                      </Text>
                    ) : (
                      <></>
                    )}
                    <Select
                      accessibilityLabel="STATE"
                      placeholder="State"
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
                      {STATES.map((state) => {
                        return (
                          <Select.Item
                            pl={3}
                            key={state.code}
                            label={state.name}
                            value={state.code}
                          />
                        );
                      })}
                    </Select>
                  </>
                )}
                name="state"
              />
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, value } }) => (
                  <AppInput
                    type="number"
                    label="Zip Code"
                    onChange={onChange}
                    value={value}
                  />
                )}
                name="zip"
              />
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
                    borderWidth={areaOption.selected ? 1 : 0}
                    borderColor={AppColors.TEAL}
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
                    borderWidth={option.selected ? 1 : 0}
                    borderColor={AppColors.TEAL}
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
                    borderWidth={option.selected ? 1 : 0}
                    borderColor={AppColors.TEAL}
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
                    borderWidth={poolType.selected ? 1 : 0}
                    borderColor={AppColors.TEAL}
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
            {Platform.OS === "ios" && <KeyboardSpacer />}
          </ScrollView>
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
      </Actionsheet.Content>
    </Actionsheet>
  );
};
