import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { MyAppButton, MyAppHeader, MyAppTextInput } from '../../utils/Components';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingTop: 60,
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = () => {
    console.log(email);
  };

  return (
    <View style={styles.container}>
      <MyAppHeader>Log in</MyAppHeader>
      <MyAppTextInput
        value={email}
        placeholder="Email"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <MyAppTextInput
        value={password}
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <MyAppButton title="Log in" onPress={onSubmit} style={{ marginTop: 10 }} />
    </View>
  );
};

export default Login;
