import { useNavigation } from '@react-navigation/native';
import { unwrapResult } from '@reduxjs/toolkit';
import i18next from 'i18next';
import React, { useState } from 'react';
import {
  View, StyleSheet, ActivityIndicator, TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import {
  MyAppButton, MyAppHeader, MyAppText, MyAppTextInput,
} from '../../utils/Components';
import {
  saveUserData, selectUserLoading, signInUser, UserDataProps,
} from './userSlice';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 26,
    paddingTop: 60,
  },
  errorMsg: {
    color: 'darkred',
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const dispatch = useAppDispatch();
  const isLoadingUser = useSelector(selectUserLoading);
  const navigation = useNavigation();

  const isInputValid = email.length > 3 && password.length > 3;

  const onSubmit = async () => {
    setError(null);
    try {
      const res = await dispatch(signInUser({ email, password }));
      unwrapResult(res);
      await dispatch(saveUserData(res.payload as UserDataProps));
      navigation.goBack();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <MyAppHeader>{i18next.t('user.logIn')}</MyAppHeader>
        <MyAppTextInput
          value={email}
          placeholder={i18next.t('user.email')}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <MyAppTextInput
          value={password}
          placeholder={i18next.t('user.password')}
          onChangeText={setPassword}
          secureTextEntry
        />
        <MyAppButton
          title={i18next.t('user.logIn')}
          disabled={isLoadingUser || !isInputValid}
          onPress={onSubmit}
          style={{ marginTop: 10 }}
        />
        { error && <MyAppText style={styles.errorMsg}>{error}</MyAppText>}
        { isLoadingUser && <ActivityIndicator size="large" color="#095b91" /> }
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
