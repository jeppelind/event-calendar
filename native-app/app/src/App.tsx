import React from 'react';
import {
  StatusBar, StyleSheet, Text, View,
} from 'react-native';
import {
  useFonts,
  // eslint-disable-next-line camelcase
  Poppins_400Regular,
} from '@expo-google-fonts/poppins';
import EventList from './features/events/EventList';
import { MyAppText } from './utils/Components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    marginTop: StatusBar.currentHeight || 25,
    // justifyContent: 'center',
  },
  header: {
    backgroundColor: 'aliceblue',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

const App = () => {
  const [fontsLoaded] = useFonts({ Poppins_400Regular });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MyAppText>Evenemangskalendern</MyAppText>
      </View>
      <EventList />
    </View>
  );
};

export default App;
