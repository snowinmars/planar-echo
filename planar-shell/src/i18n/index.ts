import i18n from 'i18next';
// import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from 'react-i18next';

import en from './lang/en.json';
import ru from './lang/ru.json';

i18n
  // .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
    },
    // detection: {
    //   order: ["localStorage", "navigator"],
    //   caches: ["localStorage"],
    //   lookupLocalStorage: "i18nextLng",
    // },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(e => console.error(e));

export default i18n;
