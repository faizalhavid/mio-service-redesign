import { Actionsheet, Divider, Text } from "native-base";
import React from "react";
import AppSafeAreaView from "../../components/AppSafeAreaView";

type TermsAndConditionsProps = {
  show: boolean;
  setShow: Function;
};

const TermsAndConditions = ({
  show,
  setShow,
}: TermsAndConditionsProps): JSX.Element => {
  return (
    <>
      <Actionsheet
        isOpen={show}
        onClose={() => {
          setShow(false);
        }}
      >
        <Actionsheet.Content pl={10} pr={10} maxH={600}>
          <Divider thickness={0} mt={5} />
          <Text fontWeight={"semibold"} fontSize={20}>
            Terms & Conditions
          </Text>
          <Divider thickness={0} mt={5} />

          <Text textAlign={"justify"}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
          </Text>
          <Divider thickness={0} mt={10} />
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default TermsAndConditions;
