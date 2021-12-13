import { NativeStackNavigationHelpers } from '@react-navigation/native-stack/lib/typescript/src/types';
import React from 'react';
import { Button, View } from 'react-native';
import { MyAppText } from '../../utils/Components';

type ScreenProps = {
  navigation: NativeStackNavigationHelpers,
}

const Login = ({ navigation }: ScreenProps) => (
  <View>
    <MyAppText>Login</MyAppText>
    <Button title="Cancel" onPress={() => navigation.navigate('Home')} />
  </View>
);

export default Login;
