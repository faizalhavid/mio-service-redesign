import { VStack, HStack, Divider, Text, Pressable } from "native-base";
import React from "react";
import { AppColors } from "../../commons/colors";
import { Address } from "../../contexts/AuthContext";

type AddressListItemProps = {
  showEdit?: boolean;
  showDelete?: boolean;
  showChoose?: boolean;
  address: Address;
  position: number;
  onEdit?: (address: Address) => void;
  onDelete?: (address: Address) => void;
  onChoose?: (address: Address) => void;
};

const AddressListItem = ({
  showChoose = false,
  showEdit = false,
  showDelete = false,
  address,
  position,
  onEdit,
  onDelete,
  onChoose,
}: AddressListItemProps): JSX.Element => {
  const ValueText = ({ text }: { text: string | number }): JSX.Element => {
    return (
      <Text
        color={AppColors.SECONDARY}
        textTransform={"uppercase"}
        fontWeight={"semibold"}
        fontSize={13}
      >
        {text}
      </Text>
    );
  };

  const EditButton = ({
    text,
    color,
    px,
    onPress,
  }: {
    text: string;
    px?: number;
    color?: string;
    onPress: () => void;
  }): JSX.Element => {
    return (
      <Pressable
        onPress={onPress}
        px={px === undefined ? 2 : px}
        borderRadius={5}
        _pressed={{ backgroundColor: AppColors.LIGHT_TEAL }}
      >
        <Text
          color={color || AppColors.DARK_TEAL}
          fontWeight="semibold"
          fontSize={12}
        >
          {text}
        </Text>
      </Pressable>
    );
  };

  return (
    <VStack
      key={address.googlePlaceId}
      // space={2}
      // borderBottomWidth={2}
      borderRadius={3}
      borderColor={AppColors.TEAL}
      borderStyle={"dotted"}
      // py={1}
      // px={1}
    >
      <HStack justifyContent={"space-between"}>
        <HStack alignItems={"flex-end"} space={1}>
          <Text
            color={AppColors.TEAL}
            letterSpacing={0.3}
            fontSize={13}
            fontWeight={"semibold"}
          >
            Property {position}
          </Text>
          {address?.isPrimary && (
            <Text
              color={AppColors.AAA}
              fontWeight={"normal"}
              letterSpacing={1}
              fontSize={10}
            >
              PRIMARY
            </Text>
          )}
        </HStack>

        <HStack space={3} px={1}>
          {showChoose && !address?.isPrimary && (
            <EditButton
              onPress={() => {
                if (onChoose) {
                  onChoose(address);
                }
              }}
              px={0}
              text="CHOOSE"
            />
          )}
          {showEdit && (
            <EditButton
              onPress={() => {
                if (onEdit) {
                  onEdit(address);
                }
              }}
              px={0}
              text="EDIT"
            />
          )}
          {showDelete && !address?.isPrimary && (
            <EditButton
              color={AppColors.WARNING}
              onPress={() => {
                if (onDelete) {
                  onDelete(address);
                }
              }}
              px={0}
              text="DELETE"
            />
          )}
        </HStack>
      </HStack>
      <Divider thickness={0.8} my={1} bg={AppColors.LIGHT_TEAL} />
      <Text fontSize={13} color={AppColors.SECONDARY} fontWeight={"semibold"}>
        {`${address.street}, ${address.city}, ${address.state}, ${address.zip}`}
      </Text>
      <Divider
        thickness={0}
        my={1}
        borderStyle={"dashed"}
        bg={AppColors.LIGHT_TEAL}
      />
      <HStack justifyContent={"space-between"}>
        <VStack>
          <Text color={AppColors.AAA} letterSpacing={0.5} fontSize={10}>
            LOT SIZE (SQFT)
          </Text>
          <ValueText text={address?.houseInfo?.lotSize || "-"} />
        </VStack>
        <VStack>
          <Text color={AppColors.AAA} letterSpacing={0.5} fontSize={10}>
            BEDROOM
          </Text>
          <ValueText text={address?.houseInfo?.bedrooms || "-"} />
        </VStack>
        <VStack>
          <Text color={AppColors.AAA} letterSpacing={0.5} fontSize={10}>
            BATHROOM
          </Text>
          <ValueText text={address?.houseInfo?.bathrooms || "-"} />
        </VStack>

        <VStack>
          <Text color={AppColors.AAA} letterSpacing={0.5} fontSize={10}>
            POOL TYPE
          </Text>
          <ValueText text={address?.houseInfo?.swimmingPoolType || "-"} />
        </VStack>
      </HStack>
    </VStack>
  );
};

export default AddressListItem;
