import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { MyAppText } from '../../utils/Components';
import EventList from '../events/EventList';

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'aliceblue',
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

type ScreenProps = {
  navigation: NativeStackNavigationHelpers,
}

const HomeScreen = ({ navigation }: ScreenProps) => (
  <View>
    {/* <View style={styles.header}>
      <MyAppText>Evenemangskalendern</MyAppText>
    </View> */}
    <Button title="Login" onPress={() => navigation.navigate('Login')} />
    <EventList />
  </View>
);

export default HomeScreen;
