import { Button, HStack, Pressable, Text, View, VStack } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";

type ServiceDetailsSectionProps = {
  title: string;
  showEdit: boolean;
  onEdit: () => void;
  children: React.ReactNode;
};

const ServiceDetailsSection = ({
  title,
  children,
  showEdit,
  onEdit,
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
            {showEdit && (
              <Pressable onPress={onEdit} alignSelf={"center"}>
                <Text
                  color={AppColors.SECONDARY}
                  fontWeight={"semibold"}
                  fontSize={12}
                >
                  EDIT
                </Text>
              </Pressable>
            )}
            {/* <Pressable onPress={() => {}} alignSelf={"center"}>
              <Text color={"red.700"} fontWeight={"semibold"} fontSize={10}>
                REMOVE
              </Text>
            </Pressable> */}
          </HStack>
        </HStack>
        <VStack my={2} mx={1} space={2}>
          {children}
        </VStack>
      </VStack>
    </>
  );
};

export default ServiceDetailsSection;
