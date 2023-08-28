import { Center, Image, Spinner, useColorModeValue, View, VStack } from 'native-base';
import React from 'react';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '../../commons/colors';
import AppBannerWrapper from '../AppBannerWrapper';
import { AppStatusBar } from '../AppStatusBar';

type AppSafeAreaViewProps = {
  bg?: string;
  mt?: number;
  logo?: boolean;
  statusBarColor?: string;
  hiddenBar?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
};

function AppSafeAreaView({
  bg,
  mt = 0,
  logo,
  statusBarColor,
  hiddenBar,
  children,
  loading,
}: AppSafeAreaViewProps): JSX.Element {
  return (
    <SafeAreaView
      edges={['right', 'left']}
      // mode="margin"
      style={{
        flex: 1,
        flexDirection: 'column',
        backgroundColor: bg || useColorModeValue('white', 'black'),
      }}
    >
      <AppStatusBar
        ishidden={hiddenBar}
        color={statusBarColor || useColorModeValue('white', 'black')}
      />
      <AppBannerWrapper />
      {loading && (
        <View
          position="absolute"
          width="100%"
          height={Dimensions.get('screen').height}
          bg="rgba(0,0,0,0.5)"
          zIndex={999}
          flex={1}
          justifyContent="center"
        >
          <Center>
            {logo && (
              <View
                style={{
                  marginBottom: 250,
                  marginTop: 80,
                }}
              >
                <Image source={require('../../assets/images/mio-logo-green.png')} />
              </View>
            )}
            <VStack>
              <Spinner size="lg" color={AppColors.PRIMARY} />
              {/* <Text mt={10}>Loading</Text> */}
            </VStack>
          </Center>
        </View>
      )}
      {children}
    </SafeAreaView>
  );
}

export default AppSafeAreaView;
