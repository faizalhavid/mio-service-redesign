import { Actionsheet, Divider, Text } from "native-base";
import React from "react";

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
          <Divider thickness={0} mt={10} />
        </Actionsheet.Content>
      </Actionsheet>
    </>
  );
};

export default TermsAndConditions;
