import LottieView from 'lottie-react-native';
import { Center, Text, VStack } from 'native-base';
import React from 'react';
import { SvgCss } from 'react-native-svg';
import { COLOR_LOGO } from '../../commons/assets';
import AppSafeAreaView from '../AppSafeAreaView';

function AppUpdate(): JSX.Element {
  return (
    <AppSafeAreaView>
      <VStack>
        <Center>
          <SvgCss width={100} height={70} style={{ marginTop: 50 }} xml={COLOR_LOGO} />
          <LottieView
            source={require('../../assets/images/updating.json')}
            autoPlay
            loop
            style={{
              marginTop: 30,
              width: 200,
              height: 200,
            }}
          />
        </Center>
        <Center>
          <Text mt={100} fontWeight="semibold" textAlign="center">
            Give us a second...{'\n'}Upgrading your app experience...
          </Text>
        </Center>
      </VStack>
    </AppSafeAreaView>
  );
}

export default AppUpdate;
