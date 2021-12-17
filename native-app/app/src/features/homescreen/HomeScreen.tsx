import React from 'react';
import { View } from 'react-native';
import EventList from '../events/EventList';

const HomeScreen = () => (
  <View>
    {/* <StatusBar barStyle="light-content" /> */}
    <EventList />
  </View>
);

export default HomeScreen;
