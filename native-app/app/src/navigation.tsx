import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { DrawerActions, NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import HomeScreen from './features/homescreen/HomeScreen';
import Login from './features/user/Login';
import { MyAppIconButton } from './utils/Components';
import { useAppDispatch } from './app/store';
import { deleteUserData, selectUser } from './features/user/userSlice';
import AddEventModal from './features/events/AddEventModal';
import DeleteEventModal from './features/events/DeleteEventModal';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const MainNavigationStack = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUser);

  return (
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
      <Stack.Group>
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
            headerLeft: () => <MyAppIconButton icon="menu" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} />,
            headerRight: () => {
              if (user.name) {
                return <MyAppIconButton icon="add-box" onPress={() => navigation.navigate('AddEventModal')} />;
              }
              return null;
            },
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
      </Stack.Group>
      <Stack.Group screenOptions={{ presentation: 'modal' }}>
        <Stack.Screen
          name="DeleteEventModal"
          component={DeleteEventModal}
          options={{ title: 'Delete event' }}
        />
        <Stack.Screen
          name="AddEventModal"
          component={AddEventModal}
          options={{ title: 'New event' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const CustomDrawerContent = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);

  const labelStyle = { fontSize: 16, fontFamily: 'Poppins_400Regular' };

  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="Start"
        labelStyle={labelStyle}
        onPress={() => navigation.navigate('Home')}
      />
      {
        user.name ? (
          <DrawerItem
            label="Log out"
            labelStyle={labelStyle}
            onPress={() => {
              dispatch(deleteUserData());
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          />
        ) : (
          <DrawerItem
            label="Log in"
            labelStyle={labelStyle}
            onPress={() => navigation.navigate('Login')}
          />
        )
      }
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
