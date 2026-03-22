import { TFunction } from 'i18next';

export type Language = 'ru' | 'en';

export type ValidationState = Readonly<{
  path: string;
  loading: boolean;
  comment: string;
  status: 'normal' | 'success' | 'error';
  setPath: (path: string) => void;
  validate: (weiduExePath: string, lang: Language, t: TFunction<'translation', undefined>) => Promise<void>;
}>;
