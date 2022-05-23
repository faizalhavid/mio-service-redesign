import {
  Actionsheet,
  Center,
  CheckIcon,
  Divider,
  Text,
  Select,
  VStack,
  Spacer,
  HStack,
  Pressable,
  Spinner,
  ScrollView,
} from "native-base";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, Keyboard, Platform } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../commons/colors";
import { STATES } from "../../commons/dropdown-values";
import { POOL_TYPES, PEST_TYPES } from "../../commons/options";
import { SAMPLE } from "../../commons/sample";
import { HouseInfoAddressRequest, Option, PriceMap } from "../../commons/types";
import { FAILED } from "../../commons/ui-states";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { LAWN_CARE_ID } from "../../screens/Home/ChooseService";
import {
  selectCustomer,
  selectHouseInfo,
  getHouseInfoAsync,
  putCustomerAsync,
} from "../../slices/customer-slice";
import { getServicesAsync, selectServices } from "../../slices/service-slice";
import AppInput from "../AppInput";
import ErrorView from "../ErrorView";
import FooterButton from "../FooterButton";
import KeyboardSpacer from "react-native-keyboard-spacer";

type UPDATE_ADDRESS = "UPDATE_ADDRESS";
type UPDATE_PROPERTY = "UPDATE_PROPERTY";
type BOTH = "BOTH";

export type AddressMode = UPDATE_ADDRESS | UPDATE_PROPERTY | BOTH;
export type BathBedOptions = { number: number; selected: boolean };
interface SelectOption extends Option {
  selected: boolean;
}

type AddressBottomSheetProps = {
  showEditAddress: boolean;
  setShowEditAddress: Function;
  mode: AddressMode;
  hideAfterSave?: boolean;
};

export const AddressBottomSheet = ({
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

  const [bathroomOptions, setBathroomOptions] = React.useState<
    BathBedOptions[]
  >([]);
  const [bedroomOptions, setBedroomOptions] = React.useState<BathBedOptions[]>(
    []
  );

  const [poolTypeOptions, setPoolTypeOptions] = React.useState<SelectOption[]>(
    []
  );
  const [pestTypeOptions, setPestTypeOptions] = React.useState<SelectOption[]>(
    []
  );

  const [selectedPoolType, setSelectedPoolType] = useState<string>("");

  const { uiState: customerUiState, member: customer } =
    useAppSelector(selectCustomer);

  const { collection: allServices } = useAppSelector(selectServices);

  const { uiState: houseInfoUiState } = useAppSelector(selectHouseInfo);

  useEffect(() => {
    if (showEditAddress) {
      dispatch(getServicesAsync());
    }
  }, []);

  useEffect(() => {
    if (showEditAddress) {
      if (
        customer &&
        customer?.addresses?.length > 0 &&
        customer?.addresses[0] &&
        customer?.addresses[0].zip
      ) {
        setValue("street", customer.addresses[0].street);
        setValue("city", customer.addresses[0].city);
        setValue("state", customer.addresses[0].state);
        setValue("zip", customer.addresses[0].zip);
      }

      if (customer && customer?.addresses?.length > 0) {
        let poolTypes: SelectOption[] = [];
        for (let poolType of POOL_TYPES) {
          let selected =
            customer?.addresses[0]?.houseInfo?.swimmingPoolType ===
            poolType.code;
          poolTypes.push({
            ...poolType,
            selected,
          });
          if (selected) {
            setSelectedPoolType(poolType.code);
          }
        }
        setPoolTypeOptions(poolTypes);

        let pestTypes: SelectOption[] = [];
        for (let pestType of PEST_TYPES) {
          let selected =
            customer?.addresses[0]?.houseInfo?.pestType &&
            ~customer?.addresses[0]?.houseInfo?.pestType.indexOf(pestType.code)
              ? true
              : false;
          pestTypes.push({
            ...pestType,
            selected,
          });
        }
        setPestTypeOptions(pestTypes);
      }
    }
  }, [dispatch, showEditAddress, customer]);

  useEffect(() => {
    if (currentMode === "UPDATE_PROPERTY" && allServices.length > 0) {
      try {
        let hasArea = false;
        for (const service of allServices) {
          if (service.serviceId === LAWN_CARE_ID) {
            if (customer.addresses[0].houseInfo?.lotSize) {
              let priceMap: PriceMap[] = [];
              let lotsize: number = customer.addresses[0].houseInfo?.lotSize;
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
                priceMap.filter((price) => price.plan === "BASIC")
              );
            } else {
              setAreaOptions(
                service.priceMap.filter((price) => price.plan === "BASIC")
              );
            }
            break;
          }
        }
        setBathroomOptions([]);
        setBedroomOptions([]);
        let houseInfo = customer?.addresses[0]?.houseInfo;
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
    }
  }, [currentMode, allServices]);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isDirty, isValid },
  } = useForm<HouseInfoAddressRequest>({
    mode: "onChange",
    defaultValues: {
      street: SAMPLE.STREET,
      city: SAMPLE.CITY,
      state: SAMPLE.STATE,
      zip: SAMPLE.ZIP,
    },
  });

  const onSubmit = async (data: HouseInfoAddressRequest) => {
    Keyboard.dismiss();
    if (!customer?.addresses || !customer?.addresses[0]?.zip) {
      await dispatch(
        getHouseInfoAsync({
          nva: data.street,
          addresses: [
            {
              ...data,
            },
          ],
        })
      ).then(async (_houseInfo) => {
        let response: any = _houseInfo.payload;
        await dispatch(
          putCustomerAsync({
            ...customer,
            addresses: [
              {
                ...data,
                googlePlaceId: response?.googlePlaceId,
                houseInfo: {
                  ...response?.houseInfo,
                },
              },
            ],
          })
        );
      });
    } else {
      await dispatch(
        putCustomerAsync({
          ...customer,
          addresses: [
            {
              ...customer?.addresses[0],
              ...data,
            },
          ],
        })
      );
    }
    if (hideAfterSave) {
      setShowEditAddress(false);
    } else {
      setCurrentMode("UPDATE_PROPERTY");
    }
  };

  const savePropertyDetails = async () => {
    await dispatch(
      putCustomerAsync({
        ...customer,
        addresses: [
          {
            ...customer.addresses[0],
            houseInfo: {
              ...customer.addresses[0].houseInfo,
              lotSize: selectedArea,
              bedrooms: selectedBedroomNo,
              bathrooms: selectedBathroomNo,
              swimmingPoolType: selectedPoolType,
              pestType: pestTypeOptions
                .filter((option) => option.selected)
                .map((option) => option.code),
            },
          },
        ],
      })
    );

    setShowEditAddress(false);
  };

  return (
    <Actionsheet
      isOpen={showEditAddress}
      onClose={() => setShowEditAddress(false)}
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
          {currentMode === "UPDATE_ADDRESS" && (
            <Center>
              <Text fontSize={18} fontWeight="semibold">
                Address
              </Text>
            </Center>
          )}
          {currentMode === "UPDATE_PROPERTY" && (
            <Center>
              <Text fontSize={18} fontWeight="semibold">
                Property Details
              </Text>
            </Center>
          )}
          {currentMode === "BOTH" && (
            <Center>
              <Text fontSize={18} fontWeight="semibold">
                Update Address
              </Text>
            </Center>
          )}
          <Spacer borderWidth={0.5} mt={3} borderColor={AppColors.CCC} />
          {/* <KeyboardAwareScrollView
              enableOnAndroid={true}
              style={{
                padding: 0,
                margin: 0,
              }}
            > */}
          <ScrollView width={"100%"}>
            <VStack px={4} space={0} pb={75} bg={AppColors.EEE}>
              {(customerUiState === FAILED || houseInfoUiState === FAILED) && (
                <ErrorView
                  message={
                    "Something went wrong while updating address. Please try again."
                  }
                />
              )}
              {(currentMode === "UPDATE_ADDRESS" || currentMode === "BOTH") && (
                <>
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
                          <Divider thickness={0} mt={2} />
                        )}
                        <Select
                          accessibilityLabel="STATE"
                          placeholder="State"
                          borderBottomWidth={1}
                          borderBottomColor={"#ccc"}
                          _selectedItem={{
                            bg: AppColors.PRIMARY,
                            endIcon: <CheckIcon size="5" />,
                          }}
                          pl={-10}
                          mt={value ? -3 : 4}
                          fontSize={14}
                          variant="underlined"
                          onValueChange={onChange}
                          selectedValue={value}
                        >
                          {STATES.map((state) => {
                            return (
                              <Select.Item
                                pl={0}
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
                        label="Zipcode"
                        onChange={onChange}
                        value={value}
                      />
                    )}
                    name="zip"
                  />
                </>
              )}
              {(currentMode === "UPDATE_PROPERTY" ||
                currentMode === "BOTH") && (
                <>
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
                          let updatedList = poolTypeOptions.map(
                            (pm2, index2) => {
                              if (index == index2) {
                                let selected: SelectOption = {
                                  ...pm2,
                                  selected: true,
                                };
                                setSelectedPoolType(pm2.code);
                                return selected;
                              }
                              return { ...pm2, selected: false };
                            }
                          );
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
                  <Text
                    fontSize={14}
                    fontWeight={"semibold"}
                    width={"100%"}
                    color={AppColors.SECONDARY}
                    mt={3}
                  >
                    Choose Pest Types
                  </Text>
                  <HStack
                    space={2}
                    maxWidth={screenWidth}
                    flexWrap={"wrap"}
                    flexDirection="row"
                  >
                    {pestTypeOptions.map((pestType, index) => (
                      <Pressable
                        key={index}
                        height={10}
                        borderRadius={5}
                        width={"30%"}
                        mt={2}
                        justifyContent="center"
                        borderWidth={pestType.selected ? 1 : 0}
                        borderColor={AppColors.TEAL}
                        bg={pestType.selected ? AppColors.LIGHT_TEAL : "#fff"}
                        _pressed={{
                          borderColor: AppColors.TEAL,
                          borderWidth: 1,
                          backgroundColor: AppColors.LIGHT_TEAL,
                        }}
                        onPress={() => {
                          let updatedList = pestTypeOptions.map(
                            (pm2, index2) => {
                              if (index == index2) {
                                let option: SelectOption = {
                                  ...pm2,
                                  selected: !pm2.selected,
                                };
                                return option;
                              }
                              return pm2;
                            }
                          );
                          setPestTypeOptions(updatedList);
                        }}
                      >
                        <Text
                          alignSelf={"center"}
                          color={AppColors.TEAL}
                          fontWeight={"semibold"}
                        >
                          {pestType.label}
                        </Text>
                      </Pressable>
                    ))}
                  </HStack>
                  <Divider mt={20} thickness={0} />
                </>
              )}
            </VStack>
            {Platform.OS === "ios" && <KeyboardSpacer />}
          </ScrollView>
          {/* </KeyboardAwareScrollView> */}
        </VStack>
        {houseInfoUiState === "IN_PROGRESS" ||
        customerUiState === "IN_PROGRESS" ? (
          <Spinner my={15} />
        ) : (
          <>
            {currentMode === "UPDATE_ADDRESS" && (
              <FooterButton
                disabled={(!isValid && isDirty) || !isDirty}
                minLabel="SAVE"
                maxLabel={"ADDRESS"}
                type="ADDRESS"
                onPress={handleSubmit(onSubmit)}
              />
            )}
            {currentMode === "UPDATE_PROPERTY" && (
              <FooterButton
                disabled={
                  !selectedArea ||
                  !selectedBathroomNo ||
                  !selectedBedroomNo ||
                  !selectedPoolType
                }
                minLabel="SAVE"
                maxLabel={"DETAILS"}
                type="ADDRESS"
                onPress={savePropertyDetails}
              />
            )}
          </>
        )}
      </Actionsheet.Content>
    </Actionsheet>
  );
};
