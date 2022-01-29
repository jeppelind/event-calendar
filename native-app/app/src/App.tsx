import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import {
  useFonts,
  // eslint-disable-next-line camelcase
  Poppins_400Regular,
  // eslint-disable-next-line camelcase
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppLoading from 'expo-app-loading';
import RootNavigation from './navigation';
import { useAppDispatch } from './app/store';
import { loadUserData } from './features/user/userSlice';
import { lightTheme } from './utils/color';

const App = () => {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserData());
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={lightTheme.primary} />
      <SafeAreaView style={{ flex: 1, backgroundColor: lightTheme.primary }}>
        <RootNavigation />
      </SafeAreaView>
    </>
  );
};

export default App;
