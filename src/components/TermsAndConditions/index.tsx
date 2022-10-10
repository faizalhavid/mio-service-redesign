import { Actionsheet, Divider, Text, View } from "native-base";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import Pdf from "react-native-pdf";

type TermsAndConditionsProps = {
  show: boolean;
  setShow: Function;
};

function TermsAndConditions({
  show,
  setShow,
}: TermsAndConditionsProps): JSX.Element {
  const source = {
    uri: "https://storage.googleapis.com/homeservices-dev-ab7f9.appspot.com/Terms%26Conditions/TNC.pdf",
    cache: true,
  };

  return (
    <Actionsheet
        isOpen={show}
        onClose={() => {
          setShow(false);
        }}
      >
        <Actionsheet.Content pl={10} pr={10} height={600} maxH={600}>
          <Divider thickness={0} mt={5} />
          <Text fontWeight="semibold" fontSize={20}>
            Terms & Conditions
          </Text>
          <View style={styles.container}>
            <Pdf source={source} scale={1} style={styles.pdf} />
          </View>
        </Actionsheet.Content>
      </Actionsheet>
  );
}

export default TermsAndConditions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
});
