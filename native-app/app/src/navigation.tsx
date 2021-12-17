import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button } from 'react-native';
import HomeScreen from './features/homescreen/HomeScreen';
import Login from './features/user/Login';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MainNavigationStack = () => {
  const navigation = useNavigation();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#00416d' },
        headerTitleStyle: {
          fontFamily: 'Poppins_400Regular',
        },
        headerShadowVisible: false,
        headerTintColor: 'white',
        contentStyle: {
          backgroundColor: '#ecf0f1',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Evenemangskalendern',
          headerTitleStyle: {
            fontFamily: 'Poppins_700Bold',
            fontSize: 14,
          },
          headerTitleAlign: 'center',
          headerLeft: () => <Button title="Menu" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />,
          // headerRight: () => <Button title="BTN" onPress={() => navigation.navigate('Login')} />,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
      />
    </Stack.Navigator>
  );
};

const CustomDrawerContent = () => {
  const navigation = useNavigation();

  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="Start"
        onPress={() => navigation.navigate('Home')}
      />
      <DrawerItem
        label="Login"
        onPress={() => navigation.navigate('Login')}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigation = () => (
  <Drawer.Navigator
    initialRouteName="Start"
    screenOptions={{
      headerShown: false,
    }}
    drawerContent={() => <CustomDrawerContent />}
  >
    <Drawer.Screen
      name="Start"
      component={MainNavigationStack}
    />
  </Drawer.Navigator>
);

const RootNavigation = () => (
  <NavigationContainer>
    <DrawerNavigation />
  </NavigationContainer>
);

export default RootNavigation;
