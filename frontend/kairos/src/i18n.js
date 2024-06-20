import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationEN from './locales/en/translation.json';
import translationEL from './locales/el/translation.json';
import translationFR from './locales/fr/translation.json';
// Add other languages as needed

const resources = {
  en: {
    translation: translationEN,
  },
  el: {
    translation: translationEL,
  },
  fr: {
    translation: translationFR,
  },
  // Add other languages as needed
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'el',  // Set Greek as the default language
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
