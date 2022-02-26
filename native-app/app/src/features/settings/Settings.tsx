import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import i18next, { changeLanguage } from 'i18next';
import { useSelector } from 'react-redux';
import { MyAppText } from '../../utils/Components';
import { changeLanguageSetting, saveSettings, selectSettingsLanguage } from './settingsSlice';
import { useAppDispatch } from '../../app/store';

const languages = [
  { key: 'system', label: 'Auto' },
  { key: 'en', label: 'English' },
  { key: 'sv', label: 'Svenska' },
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
      <Picker
        selectedValue={selectedLanguage}
        onValueChange={onSelectLanguage}
      >
        {
          languages.map((opt) => <Picker.Item key={opt.key} label={opt.label} value={opt.key} />)
        }
      </Picker>
    </View>
  );
};

export default Settings;
