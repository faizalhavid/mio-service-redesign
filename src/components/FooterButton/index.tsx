import { Button, Icon, InfoIcon, Text } from "native-base";
import React from "react";

type FooterButtonProps = {
  onPress: () => void;
};

const FooterButton = ({ onPress }: FooterButtonProps): JSX.Element => {
  return (
    <>
      <Button
        borderRadius={0}
        position={"absolute"}
        bottom={0}
        backgroundColor={"teal.800"}
        height={75}
        width={"100%"}
        onPress={onPress}
      >
        <Text
          style={{
            color: "white",
            fontSize: 14,
          }}
        >
          CREATE ACCOUNT
        </Text>
      </Button>
    </>
  );
};

export default FooterButton;
