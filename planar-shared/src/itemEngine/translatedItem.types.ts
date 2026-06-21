import type { UntranslatedItem } from './untranslatedItem.types.js';

export type TranslatedItem = UntranslatedItem & Readonly<{
  unidentifiedNameTlk: string;
  identifiedNameTlk: string;
  unidentifiedDescriptionTlk: string;
  identifiedDescriptionTlk: string;
}>;
