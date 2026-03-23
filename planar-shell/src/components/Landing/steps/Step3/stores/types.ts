import type { GameLanguage } from '@planar/shared';
import type { TFunction } from 'i18next';

export type ValidationState = Readonly<{
  path: string;
  loading: boolean;
  comment: string;
  status: 'normal' | 'success' | 'error';
  setPath: (path: string) => void;
  validate: (weiduExePath: string, lang: GameLanguage, t: TFunction<'translation', undefined>) => Promise<void>;
}>;
