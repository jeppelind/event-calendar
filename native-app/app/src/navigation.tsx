import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Pressable } from 'react-native';
import HomeScreen from './features/homescreen/HomeScreen';
import Login from './features/user/Login';
import { MyAppText } from './utils/Components';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MenuButton = () => {
  const navigation = useNavigation();
  return (
    <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
      <MyAppText style={{ color: '#ecf0f1' }}>MENU</MyAppText>
    </Pressable>
  );
};

const MainNavigationStack = () => (
  <Stack.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerStyle: { backgroundColor: '#095b91' },
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
        headerLeft: () => <MenuButton />,
        // headerRight: () => <Button title="BTN" onPress={() => navigation.navigate('Login')} />,
      }}
    />
    <Stack.Screen
      name="Login"
      component={Login}
    />
  </Stack.Navigator>
);

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
