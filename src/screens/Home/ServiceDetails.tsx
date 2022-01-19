import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Text, VStack } from "native-base";
import React from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";
import { SuperRootStackParamList } from "../../navigations";

type ServiceDetailsProps = NativeStackScreenProps<
  SuperRootStackParamList,
  "ServiceDetails"
>;
const ServiceDetails = ({ route }: ServiceDetailsProps): JSX.Element => {
  const { mode } = route.params;
  const [isPreview, setIsPreview] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  React.useEffect(() => {
    if (mode) {
      setIsPreview(mode === "PREVIEW");
      setIsEdit(mode === "EDIT");
    }
  }, [mode]);
  return (
    <AppSafeAreaView>
      <VStack mt={5} space={5}>
        {isEdit && (
          <Text textAlign={"center"} fontSize={20}>
            Let's make sure {"\n"} we've got the right place
          </Text>
        )}
        {isPreview && (
          <Text textAlign={"center"} fontSize={20}>
            Order Summary
          </Text>
        )}
      </VStack>
    </AppSafeAreaView>
  );
};

export default ServiceDetails;
