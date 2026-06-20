import { GameLanguage, nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiFsValidateChitinKeyFile } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { LandingState, LandingStateStep3, ZustandGetType, ZustandSetType } from './types';
import type { StateCreator } from 'zustand';
import type { PostApiFsValidateChitinKeyFileErrors } from '@/swagger/client';
import { debounce, interval, Subject } from 'rxjs';

type FormErrorStateProps = PostApiFsValidateChitinKeyFileErrors[404];
const translateErrorState = (error: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step3.comments.connection';
  switch (error.error.code) {
    case 'FILE_NOT_FOUND': return 'landing.step3.comments.FILE_NOT_FOUND';
    default: return 'landing.step3.comments.unknown';
  }
};

const validate = async (serverUrl: string, gameLanguage: GameLanguage, weiduExeDir: string, set: ZustandSetType<LandingStateStep3>, get: ZustandGetType<LandingStateStep3>) => {
  const { chitinKeyFile } = get();

  if (!chitinKeyFile || !gameLanguage || !weiduExeDir) {
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
    const { data, error } = await postApiFsValidateChitinKeyFile({
      client,
      baseURL: serverUrl,
      body: { weiduExeDir, gameLanguage, chitinKeyFile },
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
      const { serverUrl, gameLanguage, weiduExeDir } = get();
      validate(serverUrl, gameLanguage as GameLanguage, weiduExeDir, set, get).catch(e => console.error(e));
    });

  const chitinKeyFile = planarLocalStorage.get<string>('chitinKeyFile', '')!;
  validate$.next();

  return {
    chitinKeyFile,
    setChitinKeyFile: (chitinKeyFile: string): void => {
      set({ chitinKeyFile });
      planarLocalStorage.set('chitinKeyFile', chitinKeyFile);
      validate$.next();
    },

    step3Valid: false,
    step3Loading: false,
    step3Comment: '',
    step3CommentArgs: {},
    step3ResultType: nothing(),

    step3Validate: () => {
      const { serverUrl, gameLanguage, weiduExeDir } = get();
      return validate(serverUrl, gameLanguage as GameLanguage, weiduExeDir, set, get);
    },
    step3Destroy: () => {
      subscription.unsubscribe();
      validate$.complete();
    },
  };
};
