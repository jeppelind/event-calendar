import i18next from 'i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import sv from './locales/sv.json';

const initI18 = () => i18next.init({
  compatibilityJSON: 'v3',
  lng: Localization.locale,
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    sv: { translation: sv },
  },
});

export default initI18;
