import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiFsValidateWeiduPath } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { LandingState, LandingStateStep2, LandingStateStep3, ZustandGetType, ZustandSetType } from './types';
import type { StateCreator } from 'zustand';
import type { PostApiFsValidateWeiduPathErrors } from '@/swagger/client';
import { debounce, interval, Subject } from 'rxjs';

type FormErrorStateProps = PostApiFsValidateWeiduPathErrors[400 | 404];
const translateErrorState = (error: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step2.comments.connection';
  switch (error.error.code) {
    case 'FILE_NOT_FOUND': return 'landing.step2.comments.FILE_NOT_FOUND';
    case 'WEIDU_ERROR': return 'landing.step2.comments.WEIDU_ERROR';
    default: return 'landing.step2.comments.unknown';
  }
};

const validate = async (serverUrl: string, set: ZustandSetType<LandingStateStep2>, get: ZustandGetType<LandingStateStep2>): Promise<void> => {
  const { weiduExePath } = get();

  if (!weiduExePath) {
    set({
      step2Loading: false,
      step2Comment: '',
      step2CommentArgs: {},
      step2ResultType: nothing(),
      step2Valid: false,
    });
    return;
  };

  set({
    step2Loading: true,
    step2Comment: 'landing.step2.comments.loading',
    step2CommentArgs: {},
    step2ResultType: nothing(),
    step2Valid: false,
  });

  try {
    const { data, error } = await postApiFsValidateWeiduPath({
      client,
      baseURL: serverUrl,
      body: { weiduExePath },
    });

    set({ step2Loading: false });

    if (error) {
      set({
        step2Comment: translateErrorState(error),
        step2CommentArgs: {},
        step2ResultType: 'error',
        step2Valid: false,
      });
    }
    else {
      set({
        step2Comment: 'landing.step2.comments.weiduExeVersion',
        step2CommentArgs: { version: data.data.version },
        step2ResultType: 'success',
        step2Valid: true,
      });
    }
  }
  catch (e: unknown) {
    console.error(e);
    set({
      step2Comment: 'landing.step2.comments.unknown',
      step2CommentArgs: {},
      step2ResultType: 'error',
      step2Valid: false,
    });
  }
};
const updateStep3Validation = (step2Valid: boolean, set: ZustandSetType<LandingStateStep3>, get: ZustandGetType<LandingStateStep3>): Promise<void> => {
  const { step3Validate } = get();
  if (step2Valid) {
    return step3Validate();
  }
  else {
    set({ step3Valid: false });
  }
  return Promise.resolve();
};

export const useLandingStoreStep2: StateCreator<LandingState, [], [], LandingStateStep2> = (set, get) => {
  const validate$ = new Subject<void>();
  const subscription = validate$
    .pipe(debounce(() => interval(1000)))
    .subscribe(() => {
      const { serverUrl } = get();
      validate(serverUrl, set, get)
        .then(() => {
          const { step2Valid } = get();
          return updateStep3Validation(step2Valid, set, get);
        })
        .then(() => {
          // const { step3Valid } = get();
          // if (step3Valid) set({ step3Valid: true });
          // else set({ step3Valid: false });
        })
        .catch(e => console.error(e));
    });

  const weiduExePath = planarLocalStorage.get<string>('weiduExePath', '')!;
  validate$.next();

  return {
    weiduExePath,
    setWeiduExePath: (weiduExePath: string): void => {
      set({ weiduExePath });
      planarLocalStorage.set('weiduExePath', weiduExePath);
      validate$.next();
    },

    step2Valid: false,
    step2Loading: false,
    step2Comment: '',
    step2CommentArgs: {},
    step2ResultType: nothing(),

    step2Validate: () => {
      const { serverUrl } = get();
      return validate(serverUrl, set, get);
    },
    step2Destroy: () => {
      subscription.unsubscribe();
      validate$.complete();
    },
  };
};
