import { GameLanguage, nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiFsValidateChitinKeyPath } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { LandingState, LandingStateStep3, ZustandGetType, ZustandSetType } from './types';
import type { StateCreator } from 'zustand';
import type { PostApiFsValidateChitinKeyPathErrors } from '@/swagger/client';
import { debounce, interval, Subject } from 'rxjs';

type FormErrorStateProps = PostApiFsValidateChitinKeyPathErrors[404];
const translateErrorState = (error: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step3.comments.connection';
  switch (error.error.code) {
    case 'FILE_NOT_FOUND': return 'landing.step3.comments.FILE_NOT_FOUND';
    default: return 'landing.step3.comments.unknown';
  }
};

const validate = async (serverUrl: string, gameLanguage: GameLanguage, weiduExePath: string, set: ZustandSetType<LandingStateStep3>, get: ZustandGetType<LandingStateStep3>) => {
  const { chitinKeyPath } = get();

  if (!chitinKeyPath || !gameLanguage || !weiduExePath) {
    set({
      step3Loading: false,
      step3Comment: '',
      step3CommentArgs: {},
      step3ResultType: nothing(),
      step3Valid: false,
    });
    return;
  };

  set({
    step3Loading: true,
    step3Comment: 'landing.step3.comments.loading',
    step3CommentArgs: {},
    step3ResultType: nothing(),
    step3Valid: false,
  });

  try {
    const { data, error } = await postApiFsValidateChitinKeyPath({
      client,
      baseURL: serverUrl,
      body: { weiduExePath, gameLanguage, chitinKeyPath },
    });

    set({ step3Loading: false });

    if (error) {
      set({
        step3Comment: translateErrorState(error),
        step3CommentArgs: {},
        step3ResultType: 'error',
        step3Valid: false,
      });
    }
    else {
      set({
        step3Comment: 'landing.step3.comments.biffsCount',
        step3CommentArgs: { biffsCount: data.data.biffsCount.toString() },
        step3ResultType: 'success',
        step3Valid: true,
      });
    }
  }
  catch (e: unknown) {
    console.error(e);
    set({
      step3Comment: 'landing.step3.comments.unknown',
      step3CommentArgs: {},
      step3ResultType: 'error',
      step3Valid: false,
    });
  }
};

export const useLandingStoreStep3: StateCreator<LandingState, [], [], LandingStateStep3> = (set, get) => {
  const validate$ = new Subject<void>();
  const subscription = validate$
    .pipe(debounce(() => interval(1000)))
    .subscribe(() => {
      const { serverUrl, gameLanguage, weiduExePath } = get();
      validate(serverUrl, gameLanguage as GameLanguage, weiduExePath, set, get).catch(e => console.error(e));
    });

  const chitinKeyPath = planarLocalStorage.get<string>('chitinKeyPath', '')!;
  validate$.next();

  return {
    chitinKeyPath,
    setChitinKeyPath: (chitinKeyPath: string): void => {
      set({ chitinKeyPath });
      planarLocalStorage.set('chitinKeyPath', chitinKeyPath);
      validate$.next();
    },

    step3Valid: false,
    step3Loading: false,
    step3Comment: '',
    step3CommentArgs: {},
    step3ResultType: nothing(),

    step3Validate: () => {
      const { serverUrl, gameLanguage, weiduExePath } = get();
      return validate(serverUrl, gameLanguage as GameLanguage, weiduExePath, set, get);
    },
    step3Destroy: () => {
      subscription.unsubscribe();
      validate$.complete();
    },
  };
};
