import { Button, HStack, Pressable, Text, View, VStack } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type ServiceDetailsSectionProps = {
  title: string;
  noData: boolean;
  children: React.ReactNode;
};

const ServiceDetailsSection = ({
  title,
  children,
  noData,
}: ServiceDetailsSectionProps): JSX.Element => {
  return (
    <>
      <VStack>
        <HStack
          bg={AppColors.PRIMARY}
          shadow={2}
          px={6}
          py={2}
          justifyContent={"space-between"}
          alignContent={"center"}
        >
          <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
            {title}
          </Text>
          <HStack space={10}>
            {/* <Pressable onPress={() => {}} alignSelf={"center"}>
              <Text
                color={AppColors.SECONDARY}
                fontWeight={"semibold"}
                fontSize={10}
              >
                EDIT
              </Text>
            </Pressable> */}
            {/* <Pressable onPress={() => {}} alignSelf={"center"}>
              <Text color={"red.700"} fontWeight={"semibold"} fontSize={10}>
                REMOVE
              </Text>
            </Pressable> */}
          </HStack>
        </HStack>
        {!noData && (
          <VStack
            my={3}
            mx={2}
            space={2}
            borderWidth={1}
            py={3}
            borderRadius={10}
            borderColor={AppColors.PRIMARY}
          >
            {children}
          </VStack>
        )}
        {noData && (
          <VStack my={3} mx={2} space={2}>
            {children}
          </VStack>
        )}
      </VStack>
    </>
  );
};

export default ServiceDetailsSection;
