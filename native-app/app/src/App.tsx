import React from 'react';
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

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <RootNavigation />;
};

export default App;
