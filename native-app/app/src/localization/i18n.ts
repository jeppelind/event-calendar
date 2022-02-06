import i18next from 'i18next';
import en from './locales/en.json';
import sv from './locales/sv.json';

const initI18 = () => i18next.init({
  compatibilityJSON: 'v3',
  lng: 'sv',
  fallbackLng: 'en',
  resources: {
    en: { translation: en },
    sv: { translation: sv },
  },
});

export default initI18;
