export type GameLanguage
  = | 'cs_CZ'
    | 'de_DE'
    | 'en_US'
    | 'fr_FR'
    | 'ko_KR'
    | 'pl_PL'
    | 'ru_RU'
;

export const gameLanguages: Record<GameLanguage, string> = {
  ru_RU: 'Русский',
  en_US: 'English',
  cs_CZ: 'Čeština',
  de_DE: 'Deutsch',
  fr_FR: 'Français',
  ko_KR: '한국어',
  pl_PL: 'Polski',
} as const;
