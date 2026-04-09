import { nothing } from '@planar/shared';
import { client } from '@/swagger/client/client.gen';
import { postApiFsValidateGhostPath } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { LandingState, LandingStateStep4, ZustandGetType, ZustandSetType } from './types';
import type { StateCreator } from 'zustand';
import type { PostApiFsValidateGhostPathErrors } from '@/swagger/client';
import { debounce, interval, Subject } from 'rxjs';

type FormErrorStateProps = PostApiFsValidateGhostPathErrors[404 | 406];
const translateErrorState = (error: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step4.comments.connection';
  switch (error.error.code) {
    case 'DIRECTORY_NOT_FOUND': return 'landing.step4.comments.DIRECTORY_NOT_FOUND';
    case 'DIRECTORY_NOT_EMPTY': return 'landing.step4.comments.DIRECTORY_NOT_EMPTY';
    default: return 'landing.step4.comments.unknown';
  }
};

const validate = async (set: ZustandSetType<LandingStateStep4>, get: ZustandGetType<LandingStateStep4>) => {
  const { ghostPath } = get();

  if (!ghostPath) {
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
    const { error } = await postApiFsValidateGhostPath({
      client,
      body: { ghostPath },
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
      validate(set, get).catch(e => console.error(e));
    });

  const ghostPath = planarLocalStorage.get<string>('ghostPath', '')!;
  validate$.next();

  return {
    ghostPath,
    setGhostPath: (ghostPath: string): void => {
      set({ ghostPath });
      planarLocalStorage.set('ghostPath', ghostPath);
      validate$.next();
    },

    step4Valid: false,
    step4Loading: false,
    step4Comment: '',
    step4CommentArgs: {},
    step4ResultType: nothing(),

    step4Validate: () => {
      return validate(set, get);
    },
    step4Destroy: () => {
      subscription.unsubscribe();
      validate$.complete();
    },
  };
};
