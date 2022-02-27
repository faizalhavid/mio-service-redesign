import {
  Actionsheet,
  Button,
  Center,
  Circle,
  Divider,
  HStack,
  ScrollView,
  Text,
  View,
  VStack,
} from "native-base";
import React from "react";
import { Dimensions } from "react-native";
import { SvgCss } from "react-native-svg";
import { AppColors } from "../../commons/colors";
import { PriceMap } from "../../commons/types";
import {
  BathBedOptions,
  HOUSE_CLEANING_ID,
  LAWN_CARE_ID,
  ServicesType,
} from "../../screens/Home/ChooseService";
import SelectionButton from "../SelectionButton";

type AddServiceBottomSheetProps = {
  toggleServiceInfo: boolean;
  status: boolean;
  setToggleServiceInfo: Function;
  chooseService: Function;
  selectedServiceInfo: ServicesType | undefined;
  propertyDetailsNeeded: boolean;
  areaOptions: PriceMap[];
  setAreaOptions: Function;
  setSelectedArea: Function;
  bedroomOptions: BathBedOptions[];
  bathroomOptions: BathBedOptions[];
  setSelectedBathroomNo: Function;
  setSelectedBedroomNo: Function;
  setBedroomOptions: Function;
  setBathroomOptions: Function;
};

const AddServiceBottomSheet = ({
  toggleServiceInfo,
  status,
  setToggleServiceInfo,
  selectedServiceInfo,
  chooseService,
  areaOptions,
  setSelectedArea,
  bedroomOptions,
  bathroomOptions,
  setSelectedBathroomNo,
  setSelectedBedroomNo,
  propertyDetailsNeeded,
  setAreaOptions,
  setBathroomOptions,
  setBedroomOptions,
}: AddServiceBottomSheetProps): JSX.Element => {
  const screenWidth = Dimensions.get("screen").width;
  const btnColor = AppColors.DARK_PRIMARY;

  return (
    <Actionsheet
      isOpen={toggleServiceInfo}
      onClose={() => setToggleServiceInfo(false)}
    >
      <Actionsheet.Content>
        <ScrollView>
          <HStack justifyContent="center" space={5}>
            <VStack space="3" p={5}>
              <View alignSelf={"center"}>
                {selectedServiceInfo?.icon && (
                  <Circle size={120} bg={AppColors.PRIMARY}>
                    <SvgCss xml={selectedServiceInfo?.icon()} />
                  </Circle>
                )}
              </View>
              <Text
                textAlign={"center"}
                color={AppColors.SECONDARY}
                fontWeight={"bold"}
                fontSize={16}
              >
                {selectedServiceInfo?.text}
              </Text>
              <Text
                textAlign={"center"}
                fontSize={14}
                color={AppColors.SECONDARY}
              >
                {selectedServiceInfo?.description}
              </Text>
              {propertyDetailsNeeded && (
                <VStack>
                  <Divider my="2" />
                  <Text
                    textAlign={"center"}
                    color={AppColors.SECONDARY}
                    fontWeight={"bold"}
                    fontSize={16}
                  >
                    Update Property Details
                  </Text>
                  {/* <Divider my="2" /> */}
                  {selectedServiceInfo?.id === LAWN_CARE_ID && (
                    <>
                      <Text
                        fontSize={14}
                        textAlign={"center"}
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
                        justifyContent={"center"}
                      >
                        {areaOptions?.map((pm0, index) => {
                          return (
                            <View mb={1} key={index}>
                              <SelectionButton
                                w={(screenWidth - 120) / 2}
                                h={38}
                                index={index}
                                onPress={(index1) => {
                                  let updatedList = areaOptions.map(
                                    (pm2, index2) => {
                                      if (index1 == index2) {
                                        setSelectedArea(pm2.rangeMax);
                                        let selected: PriceMap = {
                                          ...pm2,
                                          selected: true,
                                        };
                                        return selected;
                                      }
                                      return { ...pm2, selected: false };
                                    }
                                  );
                                  setAreaOptions(updatedList);
                                }}
                                active={pm0.selected}
                                text={`${pm0.rangeMin} - ${pm0.rangeMax}`}
                              />
                            </View>
                          );
                        })}
                      </HStack>
                    </>
                  )}
                  {selectedServiceInfo?.id === HOUSE_CLEANING_ID && (
                    <>
                      <Text
                        fontSize={14}
                        textAlign={"center"}
                        fontWeight={"semibold"}
                        width={"100%"}
                        color={AppColors.SECONDARY}
                        my={3}
                      >
                        Number of Bedrooms
                      </Text>
                      <HStack
                        space={2}
                        maxWidth={screenWidth - 40}
                        justifyContent={"center"}
                        flexWrap={"wrap"}
                        flexDirection="row"
                      >
                        {bedroomOptions.map((option, index) => {
                          return (
                            <View mb={1} key={index}>
                              <SelectionButton
                                w={(screenWidth - 60) / 7}
                                h={38}
                                index={index}
                                onPress={(index1) => {
                                  let updatedOptions = bedroomOptions.map(
                                    (opt, i) => {
                                      if (i === index1) {
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
                                    }
                                  );
                                  setBedroomOptions(updatedOptions);
                                }}
                                active={option.selected}
                                text={`${option.number}`}
                              />
                            </View>
                          );
                        })}
                      </HStack>

                      <Text
                        fontSize={14}
                        textAlign={"center"}
                        fontWeight={"semibold"}
                        width={"100%"}
                        color={AppColors.SECONDARY}
                        my={3}
                      >
                        Number of Bathrooms
                      </Text>
                      <HStack
                        space={2}
                        maxWidth={screenWidth - 40}
                        flexWrap={"wrap"}
                        justifyContent={"center"}
                        flexDirection="row"
                      >
                        {bathroomOptions.map((option, index) => {
                          return (
                            <View mb={1} key={index}>
                              <SelectionButton
                                w={(screenWidth - 60) / 7}
                                h={38}
                                index={index}
                                onPress={(index1) => {
                                  let updatedOptions = bathroomOptions.map(
                                    (opt, i) => {
                                      if (i === index1) {
                                        setSelectedBathroomNo(opt.number);
                                        return {
                                          ...opt,
                                          selected: true,
                                        };
                                      }
                                      return {
                                        ...opt,
                                        selected: false,
                                      };
                                    }
                                  );
                                  setBathroomOptions(updatedOptions);
                                }}
                                active={option.selected}
                                text={`${option.number}`}
                              />
                            </View>
                          );
                        })}
                      </HStack>
                    </>
                  )}
                </VStack>
              )}
              <Button
                mt={5}
                bg={status ? "transparent" : btnColor}
                borderColor={status ? AppColors.SECONDARY : btnColor}
                borderRadius={50}
                borderWidth={1}
                width={"100%"}
                height={50}
                onPress={() => {
                  chooseService(selectedServiceInfo?.id, true);
                  setToggleServiceInfo(false);
                }}
                _text={{
                  color: status ? AppColors.SECONDARY : "white",
                }}
                alignSelf={"center"}
                _pressed={{
                  backgroundColor: `${AppColors.DARK_PRIMARY}E6`,
                }}
              >
                {status ? "Remove" : "Add"}
              </Button>
            </VStack>
          </HStack>
        </ScrollView>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default AddServiceBottomSheet;
