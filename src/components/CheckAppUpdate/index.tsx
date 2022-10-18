import { Button, HStack, PresenceTransition, Spinner, Text } from 'native-base';
import React, { useEffect } from 'react';
import CodePush from 'react-native-code-push';
import { StorageHelper } from '../../services/storage-helper';

type CheckAppUpdateProps = {};

function CheckAppUpdate({}: CheckAppUpdateProps): JSX.Element {
  const [newUpdateFound, setNewUpdateFound] = React.useState<boolean | null>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  useEffect(() => {
    StorageHelper.getValue('NEW_UPDATE_FOUND').then((value) => {
      // setNewUpdateFound(value === 'true');
      setNewUpdateFound(true);
    });
  }, []);

  const onReload = async () => {
    setIsLoading(true);
    StorageHelper.setValue('NEW_UPDATE_FOUND', 'false');
    CodePush.restartApp();
    // CodePush.sync({ installMode: CodePush.InstallMode.IMMEDIATE }).then(
    //   (status) => {
    //     console.log(status);
    //   }
    // );
    // setIsLoading(false);
  };

  return (
    <>
      {newUpdateFound ? (
        <PresenceTransition
          visible={newUpdateFound}
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
          <HStack
            bg="blue.100"
            borderColor="blue.300"
            width="100%"
            zIndex={999}
            py={2}
            px={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Text color="blue.500" fontWeight="semibold" fontSize={16}>
              Improved App Experience!
            </Text>
            <Button variant="ghost" onPress={onReload} disabled={isLoading}>
              {isLoading ? (
                <HStack space={2}>
                  <Spinner color="green.700" size="sm" />
                  <Text color="green.700" fontWeight="semibold">
                    Reloading
                  </Text>
                </HStack>
              ) : (
                <Text color="green.700" fontWeight="semibold">
                  Reload
                </Text>
              )}
            </Button>
          </HStack>
        </PresenceTransition>
      ) : (
        <></>
      )}
    </>
  );
}

export default CheckAppUpdate;
