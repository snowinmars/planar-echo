import type { UntranslatedItem } from './untranslatedItem.types.js';

export type TranslatedCreature = UntranslatedItem & Readonly<{
  unidentifiedNameRef: number;
  identifiedNameRef: number;
  unidentifiedDescriptionRef: number;
  identifiedDescriptionRef: number;
}>;
