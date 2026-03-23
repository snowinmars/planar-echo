import { GameLanguage } from '@planar/shared';
import type { Resource } from 'i18next';
import { gameLanguages } from '@planar/shared';

type NativeLang = Readonly<{
  code: GameLanguage;
  name: string;
}>;
const getNativeLangNames = (resources: Resource): NativeLang[] => {
  return Object.keys(resources || {})
    .map((x: string): NativeLang => {
      const lang = x as GameLanguage;
      const name = gameLanguages[lang];
      if (name) return { code: lang, name };
      throw new Error(`Out of range lang ${lang}`);
    });
};

export default getNativeLangNames;
