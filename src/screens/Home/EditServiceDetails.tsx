import { VStack, Text, HStack, Divider, Actionsheet } from "native-base";
import React from "react";
import ServiceDetailsOptions from "../../components/ServiceDetailsOptions";

type EditServiceInfoProps = {
  isOpen: boolean;
  onClose: () => void;
};

const EditServiceInfo = ({
  isOpen,
  onClose,
}: EditServiceInfoProps): JSX.Element => {
  const LAWN_CARE_INFO = <ServiceDetailsOptions title="HOW BIG IS YOUR LOT?" />;
  const POOL_LEANING_INFO = (
    <ServiceDetailsOptions title="WHAT TYPE OF POOL DO YOU HAVE?" />
  );
  const HOUSE_CLEANING_INFO = (
    <>
      <ServiceDetailsOptions title="HOW MANY STORIES IN YOUR HOME?" />
      <Divider thickness={0} mt={3} />
      <ServiceDetailsOptions title="HOW MANY BEDROOMS?" />
      <Divider thickness={0} mt={3} />
      <ServiceDetailsOptions title="HOW MANY BATHROOMS?" />
    </>
  );
  const PES_CONTROL_INFO = (
    <ServiceDetailsOptions title="WHAT TYPE OF PESTS ARE YOU DEALING WITH?" />
  );

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content>
        <VStack paddingX={5} mt={10}>
          <Text fontSize={20}>
            Choose an option {"\n"}
            for your Lawn Service
          </Text>
          <VStack mt={10} space={5}>
            <HStack>
              <VStack>
                <HStack></HStack>
              </VStack>
              <VStack>
                <HStack></HStack>
              </VStack>
            </HStack>
          </VStack>
        </VStack>
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default EditServiceInfo;
