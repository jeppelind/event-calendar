import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import i18next, { changeLanguage } from 'i18next';
import { useSelector } from 'react-redux';
import { MyAppText, MyPickerAndroid, MyPickerIOS } from '../../utils/Components';
import { changeLanguageSetting, saveSettings, selectSettingsLanguage } from './settingsSlice';
import { useAppDispatch } from '../../app/store';

const languages = [
  { key: 'system', value: 'Auto' },
  { key: 'en', value: 'English' },
  { key: 'sv', value: 'Svenska' },
];

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
});

const Settings = () => {
  const language = useSelector(selectSettingsLanguage);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const dispatch = useAppDispatch();

  const onSelectLanguage = async (selectedLang: string) => {
    if (selectedLang !== language) {
      setSelectedLanguage(selectedLang);
      await changeLanguage(selectedLang);
      dispatch(changeLanguageSetting(selectedLang));
      dispatch(saveSettings());
    }
  };

  return (
    <View style={styles.container}>
      <MyAppText>{`${i18next.t('settings.language')}:`}</MyAppText>
      {Platform.OS === 'ios'
        ? (
          <MyPickerIOS
            options={languages}
            selectedValue={selectedLanguage}
            onValueChange={(value) => onSelectLanguage(value.toString())}
          />
        ) : (
          <MyPickerAndroid
            options={languages}
            selectedValue={selectedLanguage}
            onValueChange={(value) => onSelectLanguage(value.toString())}
          />
        )}
    </View>
  );
};

export default Settings;
