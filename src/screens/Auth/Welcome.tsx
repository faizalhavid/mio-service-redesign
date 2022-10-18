import LottieView from 'lottie-react-native';
import { Box, Center, Divider, PresenceTransition, ScrollView, Text, VStack } from 'native-base';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { SvgCss } from 'react-native-svg';
import { COLOR_LOGO } from '../../commons/assets';
import { AppColors } from '../../commons/colors';
import { FLAG_TYPE, STATUS } from '../../commons/status';
import AppButton from '../../components/AppButton';
import AppSafeAreaView from '../../components/AppSafeAreaView';
import GradientButton from '../../components/GradientButton';
import { useAuth } from '../../contexts/AuthContext';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { navigate } from '../../navigations/rootNavigation';
import { StorageHelper } from '../../services/storage-helper';
import { resetCustomerState } from '../../slices/customer-slice';
import { resetLeadState } from '../../slices/lead-slice';

function Welcome(): JSX.Element {
  const dispatch = useAppDispatch();
  const { logout } = useAuth();

  useEffect(() => {
    // logout(); // Just for testing
    dispatch(resetCustomerState());
    dispatch(resetLeadState());
  }, []);

  return (
    <AppSafeAreaView>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <VStack mt="1/4" pt={0}>
          <PresenceTransition
            visible
            initial={{
              opacity: 0,
              translateX: 0,
            }}
            animate={{
              opacity: 1,
              translateX: 1,
              transition: {
                duration: 350,
              },
            }}
          >
            <Center>
              <Pressable
                onPress={async () => {
                  try {
                    await StorageHelper.clear();
                    console.log('STORAGE CLEARED');
                  } catch (error) {
                    console.log('ERROR CLEARING STORAGE');
                  }
                }}
              >
                <SvgCss width={200} height={70} xml={COLOR_LOGO} />
              </Pressable>
            </Center>
          </PresenceTransition>
          <Divider thickness={0} mt={30} />
          <VStack alignItems="center">
            <Divider thickness={0} mt={30} />
            <Center>
              <Text fontWeight="semibold" fontSize={18}>
                Welcome to Mio Home Services
              </Text>
              <Text fontWeight="semibold" color={AppColors.AAA}>
                Your one destination for all the house needs
              </Text>
            </Center>
            <Divider thickness={0} mt={31} />
            <LottieView
              source={require('../../assets/images/welcome.json')}
              autoPlay
              loop
              style={{
                marginTop: 10,
                width: 200,
                height: 200,
              }}
            />
            <Divider thickness={0} mt={30} />
            <Box mx={5} width="80%">
              <GradientButton
                text="Create Account"
                onPress={() => {
                  navigate('Register');
                }}
              />
              <Divider thickness={0} mt={21} />
              <AppButton
                label="Existing user? Login"
                type="outline"
                onPress={async (event) => {
                  navigate('Login');
                }}
              />
              <Divider thickness={0} mt={21} />
              <Pressable
                onPress={async () => {
                  await StorageHelper.setValue(FLAG_TYPE.AUTHENTICATED_USER, STATUS.FALSE);
                  navigate('Dashboard');
                }}
              >
                <Text textAlign="center" color={AppColors.AAA}>
                  Skip for now
                </Text>
              </Pressable>
            </Box>
          </VStack>
        </VStack>
      </ScrollView>
      {/* </ImageBackground> */}
    </AppSafeAreaView>
  );
}

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});
