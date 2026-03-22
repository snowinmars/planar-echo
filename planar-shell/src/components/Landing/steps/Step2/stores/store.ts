// stores/validationStore.ts
import { create } from 'zustand';
import { postFsValidateWeiduPath, PostFsValidateWeiduPathErrors } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';
import { ValidationState } from './types';
import { useEffect } from 'react';
import { TFunction } from 'i18next';

type FormErrorStateProps = Readonly<{
  error: PostFsValidateWeiduPathErrors[400 | 404];
  t: TFunction<'translation', undefined>;
}>;
const translateErrorState = ({ error, t }: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return t('landing.step2.comments.connection');
  switch (error.error.code) {
    case 'FILE_NOT_FOUND': return t('landing.step2.comments.FILE_NOT_FOUND');
    case 'WEIDU_ERROR': return t('landing.step2.comments.WEIDU_ERROR');
    default: return t('landing.step2.comments.unknown');
  }
};

const useWeiduExeValidationStore = create<ValidationState>((set, get) => ({
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

  validate: async (t: TFunction<'translation', undefined>) => {
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
      comment: t('landing.step2.comments.loading'),
      status: 'normal',
    });

    try {
      const { data, error } = await postFsValidateWeiduPath({
        client,
        body: { weiduExePath: path },
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
          comment: `${t('landing.step2.comments.weiduExeVersion')} ${data.data.version}`,
          status: 'success',
        });
      }
    }
    catch (e: unknown) {
      console.error(e);
      set({
        comment: t('landing.step2.comments.unknown'),
        status: 'error',
      });
    }
  },
}));

const useWeiduValidation = (onStatusChange: (isValid: boolean) => void): ValidationState => {
  const { path, loading, comment, status, setPath, validate } = useWeiduExeValidationStore();

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

export default useWeiduValidation;
