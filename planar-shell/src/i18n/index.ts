import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import ru_RU from './lang/ru_RU.json';
import en_US from './lang/en_US.json';
import cs_CZ from './lang/cs_CZ.json';
import de_DE from './lang/de_DE.json';
import fr_FR from './lang/fr_FR.json';
import ko_KR from './lang/ko_KR.json';
import pl_PL from './lang/pl_PL.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru_RU: { translation: ru_RU },
      en_US: { translation: en_US },
      cs_CZ: { translation: cs_CZ },
      de_DE: { translation: de_DE },
      fr_FR: { translation: fr_FR },
      ko_KR: { translation: ko_KR },
      pl_PL: { translation: pl_PL },
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })
  .catch(e => console.error(e));

export default i18n;
