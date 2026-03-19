import type { Resource } from 'i18next';

type NativeLang = Readonly<{
  code: string;
  name: string;
}>
const getNativeLangNames = (resources: Resource): NativeLang[] => {
  return Object.keys(resources || {})
  .map(lang => {
    switch(lang) {
      case 'ru': return { code: 'ru', name: 'Русский'}
      case 'en': return { code: 'en', name: 'English'}
      default: throw new Error(`Out of range lang ${lang}`);
    }
  });
}
export default getNativeLangNames;
