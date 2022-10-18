import { PresenceTransition, Text, View } from 'native-base';
import React from 'react';

type CheckInternetProps = { connected: boolean | null };

function CheckInternet({ connected }: CheckInternetProps): JSX.Element {
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
          <View bg="red.100" borderColor="red.300" width="100%" zIndex={999} py={3}>
            <Text textAlign="center" color="red.500" fontWeight="semibold" fontSize={16}>
              Please check your internet connection!
            </Text>
          </View>
        </PresenceTransition>
      ) : (
        <></>
      )}
    </>
  );
}

export default CheckInternet;
