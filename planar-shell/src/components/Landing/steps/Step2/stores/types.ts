import { TFunction } from 'i18next';

export type ValidationState = {
  path: string;
  loading: boolean;
  comment: string;
  status: 'normal' | 'success' | 'error';
  setPath: (path: string) => void;
  validate: (t: TFunction<'translation', undefined>) => Promise<void>;
};
