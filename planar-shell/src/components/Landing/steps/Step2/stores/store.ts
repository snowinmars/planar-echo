import { create } from 'zustand';
import { postApiFsValidateWeiduPath, PostApiFsValidateWeiduPathErrors } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';
import { ValidationState } from './types';
import { useEffect } from 'react';

type FormErrorStateProps = Readonly<{
  error: PostApiFsValidateWeiduPathErrors[400 | 404];
}>;
const translateErrorState = ({ error }: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step2.comments.connection';
  switch (error.error.code) {
    case 'FILE_NOT_FOUND': return 'landing.step2.comments.FILE_NOT_FOUND';
    case 'WEIDU_ERROR': return 'landing.step2.comments.WEIDU_ERROR';
    default: return 'landing.step2.comments.unknown';
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

  validate: async () => {
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
      comment: 'landing.step2.comments.loading',
      status: 'normal',
    });

    try {
      const { data, error } = await postApiFsValidateWeiduPath({
        client,
        body: { weiduExePath: path },
      });

      set({ loading: false });

      if (error) {
        set({
          comment: translateErrorState({ error }),
          status: 'error',
        });
      }
      else {
        set({
          comment: `${'landing.step2.comments.weiduExeVersion'} ${data.data.version}`,
          status: 'success',
        });
      }
    }
    catch (e: unknown) {
      console.error(e);
      set({
        comment: 'landing.step2.comments.unknown',
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
