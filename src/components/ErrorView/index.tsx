import { Text, View } from "native-base";
import React from "react";

type ErrorViewProps = {
  message: string;
};

const ErrorView = ({ message }: ErrorViewProps): JSX.Element => {
  return (
    <>
      {message.length > 0 && (
        <View
          borderLeftWidth={5}
          borderRadius={5}
          bg={"red.100"}
          borderColor={"red.300"}
          padding={3}
          my={5}
        >
          <Text fontWeight={"semibold"} color={"red.500"}>
            {message}
          </Text>
        </View>
      )}
    </>
  );
};

export default ErrorView;
