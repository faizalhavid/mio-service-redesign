import React from "react";
import NetInfo from "@react-native-community/netinfo";
import { PresenceTransition, Text, View } from "native-base";

type CheckInternetProps = {
  mt?: number;
};

const CheckInternet = ({ mt }: CheckInternetProps): JSX.Element => {
  const [connected, setConnected] = React.useState<boolean | null>(true);

  NetInfo.fetch().then((state) => {
    setConnected(state.isConnected);
  });

  return (
    <>
      {!connected ? (
        <PresenceTransition
          visible={!connected}
          initial={{
            opacity: 0,
            scale: 0,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: {
              duration: 250,
            },
          }}
        >
          <View
            bg={"red.100"}
            borderColor={"red.300"}
            width="100%"
            zIndex={999}
            py={3}
            mt={mt === undefined ? 10 : mt}
          >
            <Text
              textAlign={"center"}
              color={"red.500"}
              fontWeight={"semibold"}
              fontSize={16}
            >
              Please check your internet connection!
            </Text>
          </View>
        </PresenceTransition>
      ) : (
        <></>
      )}
    </>
  );
};

export default CheckInternet;
