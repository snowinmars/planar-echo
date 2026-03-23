import { create } from 'zustand';
import { postApiFsValidateChitinKeyPath, PostApiFsValidateChitinKeyPathErrors } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';
import { Language, ValidationState } from './types';
import { useEffect } from 'react';
import { TFunction } from 'i18next';

type FormErrorStateProps = Readonly<{
  error: PostApiFsValidateChitinKeyPathErrors[404];
  t: TFunction<'translation', undefined>;
}>;
const translateErrorState = ({ error, t }: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return t('landing.step3.comments.connection');
  switch (error.error.code) {
    case 'FILE_NOT_FOUND': return t('landing.step3.comments.FILE_NOT_FOUND');
    default: return t('landing.step3.comments.unknown');
  }
};

const useChitinKeyValidationStore = create<ValidationState>((set, get) => ({
  path: '',
  loading: false,
  comment: '',
  status: 'normal',

  setPath: (path: string) => {
    if (path) return set({ path });
    set({
      path: '',
      loading: false,
      comment: '',
      status: 'normal',
    });
  },

  validate: async (weiduExePath: string, lang: Language, t: TFunction<'translation', undefined>) => {
    const { path } = get();

    if (!path) {
      set({
        loading: false,
        comment: '',
        status: 'normal',
      });
      return;
    };

    set({
      loading: true,
      comment: t('landing.step3.comments.loading'),
      status: 'normal',
    });

    try {
      const { data, error } = await postApiFsValidateChitinKeyPath({
        client,
        body: {
          weiduExePath,
          lang,
          chitinKeyPath: path,
        },
      });

      set({ loading: false });

      if (error) {
        set({
          comment: translateErrorState({ error, t }),
          status: 'error',
        });
      }
      else {
        set({
          comment: `${t('landing.step3.comments.biffsCount')} ${data.data.biffsCount}`,
          status: 'success',
        });
      }
    }
    catch (e: unknown) {
      console.error(e);
      set({
        comment: t('landing.step3.comments.unknown'),
        status: 'error',
      });
    }
  },
}));

const useChitinKeyValidation = (onStatusChange: (isValid: boolean) => void): ValidationState => {
  const { path, loading, comment, status, setPath, validate } = useChitinKeyValidationStore();

  useEffect(() => {
    onStatusChange(status === 'success');
  }, [status, onStatusChange]);

  return {
    path,
    loading,
    comment,
    status,
    setPath,
    validate,
  };
};

export default useChitinKeyValidation;
