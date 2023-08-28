import React from 'react';

import { AppColors } from '../../commons/colors';
import AppSafeAreaView from '../../components/AppSafeAreaView';

function SplashScreen(): JSX.Element {
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     navigate('Welcome');
  //   }, 3000);
  // }, []);
  return (
    <AppSafeAreaView
      bg={AppColors.SECONDARY}
      logo={true}
      loading={true}
      hiddenBar={true}
      statusBarColor={AppColors.SECONDARY}
    ></AppSafeAreaView>
  );
}
export default SplashScreen;
/* 

import React, { useEffect } from 'react';
import {Colors} from '@src/theme'
import { SafeAreaView, StyleSheet, Image, Text, Dimensions } from 'react-native';
import MioLogo from '@assets/images/Mio_Logo.png';
import Loading from '@src/components/loading';
import { useNavigation } from '@react-navigation/native';
import loadingState from '@utils/proxy';

const { height, width } = Dimensions.get('window');
const SplashScreen = () => {
  const navigation = useNavigation();
  useEffect(() => {
    const timeout = setTimeout(() => {
      loadingState.isLoading = false;
      navigation.replace('WelcomeScreen');
    }, 10000);

    return () => {
      clearTimeout(timeout); 
    };
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <Image source={MioLogo} style={styles.logo}/>
      <Loading  />
      {!loadingState.isLoading && (
        <Text>Isi konten layar di sini</Text>
      )}
     
    </SafeAreaView>
  );
};
export default SplashScreen;

const styles = StyleSheet.create({
  
  logo:{
    height: 200,
    width: 200,
    resizeMode: 'contain',
    marginTop: height * 0.2,
    marginBottom: height * 0.35,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center' ,
    flex: 1,
    backgroundColor: Colors.BOTTLE_GREEN,
  },
});


*/
