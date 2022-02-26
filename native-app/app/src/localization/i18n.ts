import i18next from 'i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import sv from './locales/sv.json';

const initI18 = (language: string) => i18next.init({
  compatibilityJSON: 'v3',
  lng: language === 'system' ? Localization.locale : language,
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    sv: { translation: sv },
  },
});

export default initI18;
