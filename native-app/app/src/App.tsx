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
import { NavigationContainer } from '@react-navigation/native';
// import EventList from './features/events/EventList';
// import { MyAppText } from './utils/Components';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './features/homescreen/HomeScreen';
import Login from './features/user/Login';
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

const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_700Bold });

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // const header = () => <MyAppText>Evenemangskalendern</MyAppText>

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#00416d' },
          headerTitleStyle: {
            fontFamily: 'Poppins_700Bold',
            fontSize: 14,
          },
          headerShadowVisible: false,
          headerTintColor: 'white',
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Evenemangskalendern',
            // headerShown: true,
            // headerBlurEffect: 'prominent',
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );

  // return (
  //   <View style={styles.container}>
  //     <NavigationContainer>
  //       <Stack.Navigator>
  //         <Stack.Screen name="Home" component={HomeScreen} />
  //         {/* <Stack.Screen name="LogIn" component={Login} /> */}
  //       </Stack.Navigator>
  //     </NavigationContainer>
  //   </View>
  // );
};

export default App;
