import { Button, HStack, Pressable, Text, View, VStack } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type ServiceDetailsSectionProps = {
  title: string;
  children: React.ReactNode;
};

const ServiceDetailsSection = ({
  title,
  children,
}: ServiceDetailsSectionProps): JSX.Element => {
  return (
    <>
      <VStack>
        <HStack
          bg={AppColors.PRIMARY}
          px={6}
          py={2}
          justifyContent={"space-between"}
          alignContent={"center"}
        >
          <Text fontWeight={"semibold"} color={AppColors.SECONDARY}>
            {title}
          </Text>
          <Pressable onPress={() => {}} alignSelf={"center"}>
            <Text color={"red.700"} fontWeight={"semibold"} fontSize={10}>
              REMOVE
            </Text>
          </Pressable>
        </HStack>
        <VStack my={3} mx={2}>
          {children}
        </VStack>
      </VStack>
    </>
  );
};

export default ServiceDetailsSection;
