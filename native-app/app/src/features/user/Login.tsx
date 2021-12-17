import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button, View } from 'react-native';
import { MyAppText } from '../../utils/Components';

const Login = () => {
  const navigation = useNavigation();

  return (
    <View>
      <MyAppText>Login</MyAppText>
      <Button title="Cancel" onPress={() => navigation.navigate('Home')} />
    </View>
  );
};

export default Login;
