import { debounce, interval, Subject } from 'rxjs';

import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import { postApiFsOpenDir, postApiFsValidateGhostDir } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { StateCreator } from 'zustand';

import type { PostApiFsOpenDirErrors, PostApiFsValidateGhostDirErrors } from '@/swagger/client';

import type { LandingState, LandingStateStep4, ZustandGetType, ZustandSetType } from './types';

type FormErrorStateProps = PostApiFsValidateGhostDirErrors[404 | 406];
const translateErrorState = (error: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step4.comments.connection';
  switch (error.error.code) {
    case 'DIRECTORY_NOT_FOUND': return 'landing.step4.comments.DIRECTORY_NOT_FOUND';
    case 'DIRECTORY_NOT_EMPTY': return 'landing.step4.comments.DIRECTORY_NOT_EMPTY';
    default: return 'landing.step4.comments.unknown';
  }
};

type OpenDirErrorStateProps = PostApiFsOpenDirErrors[400 | 404 | 500];
const translateOpenDirError = (error: OpenDirErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step4.comments.connection';
  switch (error.error.code) {
    case 'DIRECTORY_NOT_FOUND': return 'landing.step4.comments.DIRECTORY_NOT_FOUND';
    case 'NOT_A_DIRECTORY': return 'landing.step4.comments.NOT_A_DIRECTORY';
    case 'OPEN_FAILED': return 'landing.step4.comments.OPEN_FAILED';
    default: return 'landing.step4.comments.unknown';
  }
};

const openDir = async (
  serverUrl: string,
  set: ZustandSetType<LandingStateStep4>,
  get: ZustandGetType<LandingStateStep4>,
): Promise<void> => {
  const { ghostDir } = get();
  if (!ghostDir) return;

  try {
    const { error } = await postApiFsOpenDir({
      client,
      baseURL: serverUrl,
      body: { dir: ghostDir },
    });

    if (error) {
      set({
        step4Comment: translateOpenDirError(error),
        step4CommentArgs: {},
        step4ResultType: 'error',
      });
    }
  }
  catch (e: unknown) {
    console.error(e);
    set({
      step4Comment: 'landing.step4.comments.unknown',
      step4CommentArgs: {},
      step4ResultType: 'error',
    });
  }
};

const validate = async (serverUrl: string, set: ZustandSetType<LandingStateStep4>, get: ZustandGetType<LandingStateStep4>) => {
  const { ghostDir } = get();

  if (!ghostDir) {
    set({
      step4Loading: false,
      step4Comment: '',
      step4CommentArgs: {},
      step4ResultType: nothing(),
      step4Valid: false,
    });
    return;
  };

  set({
    step4Loading: true,
    step4Comment: 'landing.step4.comments.loading',
    step4CommentArgs: {},
    step4ResultType: nothing(),
    step4Valid: false,
  });

  try {
    const { error } = await postApiFsValidateGhostDir({
      client,
      baseURL: serverUrl,
      body: { ghostDir },
    });

    set({ step4Loading: false });

    if (error) {
      set({
        step4Comment: translateErrorState(error),
        step4CommentArgs: {},
        step4ResultType: 'error',
        step4Valid: false,
      });
    }
    else {
      set({
        step4Comment: 'landing.step4.comments.success',
        step4CommentArgs: {},
        step4ResultType: 'success',
        step4Valid: true,
      });
    }
  }
  catch (e: unknown) {
    console.error(e);
    set({
      step4Comment: 'landing.step4.comments.unknown',
      step4CommentArgs: {},
      step4ResultType: 'error',
      step4Valid: false,
    });
  }
};

export const useLandingStoreStep4: StateCreator<LandingState, [], [], LandingStateStep4> = (set, get) => {
  const validate$ = new Subject<void>();
  const subscription = validate$
    .pipe(debounce(() => interval(1000)))
    .subscribe(() => {
      const { serverUrl } = get();
      validate(serverUrl, set, get).catch(e => console.error(e));
    });

  const ghostDir = planarLocalStorage.get<string>('ghostDir', '')!;
  validate$.next();

  return {
    ghostDir,
    setGhostDir: (ghostDir: string): void => {
      set({ ghostDir });
      planarLocalStorage.set('ghostDir', ghostDir);
      validate$.next();
    },

    step4Valid: false,
    step4Loading: false,
    step4Comment: '',
    step4CommentArgs: {},
    step4ResultType: nothing(),

    step4Validate: () => {
      const { serverUrl } = get();
      return validate(serverUrl, set, get);
    },
    step4OpenDir: () => {
      const { serverUrl } = get();
      return openDir(serverUrl, set, get);
    },
    step4Destroy: () => {
      subscription.unsubscribe();
      validate$.complete();
    },
  };
};
