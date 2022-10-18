import NetInfo from '@react-native-community/netinfo';
import React from 'react';
import { SafeAreaView } from 'react-native';
import CheckInternet from '../CheckInternet';

function AppBannerWrapper(): JSX.Element {
  const [connected, setConnected] = React.useState<boolean | null>(true);

  NetInfo.fetch().then((state) => {
    setConnected(state.isConnected);
    // setConnected(false);
  });

  return (
    <>
      <SafeAreaView>
        <CheckInternet connected={connected} />
        {/* <CheckAppUpdate /> */}
      </SafeAreaView>
    </>
  );
}

export default AppBannerWrapper;
