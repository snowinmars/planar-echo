import { GameLanguage, objectKeys } from '@planar/shared';
import type { Resource, ResourceLanguage } from 'i18next';
import { gameLanguages } from '@planar/shared';

export type NativeLang = Readonly<{
  code: GameLanguage;
  name: string;
}>;
const getNativeLangNames = (resources: Resource): NativeLang[] => {
  return objectKeys<string, ResourceLanguage>(resources || {})
    .map((x: string): NativeLang => {
      const lang = x as GameLanguage;
      const name = gameLanguages[lang];
      if (name) return { code: lang, name };
      throw new Error(`Out of range lang ${lang}`);
    });
};

export default getNativeLangNames;
