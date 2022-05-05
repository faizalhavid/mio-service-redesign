import {
  Actionsheet,
  Center,
  CheckIcon,
  Divider,
  Text,
  Select,
  VStack,
  Button,
  Spacer,
  FlatList,
  HStack,
  Pressable,
  ScrollView,
  Spinner,
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Dimensions, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AppColors } from "../../commons/colors";
import { STATES } from "../../commons/dropdown-values";
import { FLAG_TYPE, STATUS } from "../../commons/status";
import { HouseInfoAddressRequest, PriceMap } from "../../commons/types";
import { FAILED } from "../../commons/ui-states";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { popToPop } from "../../navigations/rootNavigation";
import { LAWN_CARE_ID } from "../../screens/Home/ChooseService";
import { StorageHelper } from "../../services/storage-helper";
import {
  selectCustomer,
  selectHouseInfo,
  getCustomerByIdAsync,
  getHouseInfoAsync,
  putCustomerAsync,
} from "../../slices/customer-slice";
import { getServicesAsync, selectServices } from "../../slices/service-slice";
import AppInput from "../AppInput";
import ErrorView from "../ErrorView";
import FooterButton from "../FooterButton";

type UPDATE_ADDRESS = "UPDATE_ADDRESS";
type UPDATE_PROPERTY = "UPDATE_PROPERTY";
type BOTH = "BOTH";

export type AddressMode = UPDATE_ADDRESS | UPDATE_PROPERTY | BOTH;
export type BathBedOptions = { number: number; selected: boolean };

type AddressBottomSheetProps = {
  showEditAddress: boolean;
  setShowEditAddress: Function;
  mode: AddressMode;
};

export const AddressBottomSheet = ({
  showEditAddress,
  setShowEditAddress,
  mode,
}: AddressBottomSheetProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const screenWidth = Dimensions.get("screen").width;
  const [currentMode, setCurrentMode] = useState<AddressMode>(mode);
  const [selectedArea, setSelectedArea] = React.useState<number>(0);
  const [selectedBathroomNo, setSelectedBathroomNo] = React.useState<number>(0);
  const [selectedBedroomNo, setSelectedBedroomNo] = React.useState<number>(0);
  const [areaOptions, setAreaOptions] = React.useState<PriceMap[]>([]);
  const [propertyDetailsNeeded, setPropertyDetailsNeeded] =
    React.useState<boolean>(false);
  const [bathroomOptions, setBathroomOptions] = React.useState<
    BathBedOptions[]
  >([]);
  const [bedroomOptions, setBedroomOptions] = React.useState<BathBedOptions[]>(
    []
  );
  const { uiState: customerUiState, member: customer } =
    useAppSelector(selectCustomer);

  const { collection: allServices } = useAppSelector(selectServices);

  const { uiState: houseInfoUiState } = useAppSelector(selectHouseInfo);

  useEffect(() => {
    dispatch(getServicesAsync());
    if (customer?.addresses[0]) {
      setValue("street", customer.addresses[0].street);
      setValue("city", customer.addresses[0].city);
      setValue("state", customer.addresses[0].state);
      setValue("zip", customer.addresses[0].zip);
    }
  }, []);

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
                  lotsize > price.rangeMin &&
                  price.rangeMax !== undefined &&
                  price.rangeMax !== null &&
                  lotsize < price.rangeMax
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
              setAreaOptions(priceMap);
            } else {
              setAreaOptions(service.priceMap);
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
      // street: "21 Keen Ln",
      // city: "Edison",
      // state: "NJ",
      // zip: "08820",
    },
  });

  const onSubmit = async (data: HouseInfoAddressRequest) => {
    Keyboard.dismiss();
    if (!customer?.addresses[0]?.zip) {
      let _houseInfo = await dispatch(
        getHouseInfoAsync({
          nva: data.street,
          addresses: [
            {
              ...data,
            },
          ],
        })
      );
      await dispatch(
        putCustomerAsync({
          ...customer,
          addresses: [
            {
              ...data,
              houseInfo: {
                ..._houseInfo.payload.houseInfo,
              },
            },
          ],
        })
      );
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
    setCurrentMode("UPDATE_PROPERTY");
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
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          style={{
            width: "100%",
            padding: 0,
            margin: 0,
          }}
        >
          <VStack pt={15} bg={"white"}>
            {currentMode === "UPDATE_ADDRESS" && (
              <Center>
                <Text fontSize={18} fontWeight="semibold">
                  Add Address
                </Text>
              </Center>
            )}
            {currentMode === "UPDATE_PROPERTY" && (
              <Center>
                <Text fontSize={18} fontWeight="semibold">
                  Add Property Details
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
                    my={2}
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
                    my={2}
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
                    my={2}
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
                </>
              )}
            </VStack>
          </VStack>
        </KeyboardAwareScrollView>
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
                  !selectedArea || !selectedBathroomNo || !selectedBedroomNo
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
