import React, { useEffect } from 'react';
import {
  StatusBar, StyleSheet, Text, View,
} from 'react-native';
import {
  useFonts,
  // eslint-disable-next-line camelcase
  Poppins_400Regular,
  // eslint-disable-next-line camelcase
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import RootNavigation from './navigation';
import { useAppDispatch } from './app/store';
import { loadUserData } from './features/user/userSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 25,
  },
});

const App = () => {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadUserData());
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#095b91" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#095b91' }}>
        <RootNavigation />
      </SafeAreaView>
    </>
  );
};

export default App;
