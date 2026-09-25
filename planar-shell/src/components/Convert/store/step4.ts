import { isAxiosError } from 'axios';
import { debounce, interval, Subject } from 'rxjs';

import { nothing } from '@planar/shared';

import { backendUrl } from '@/shared/backendUrl';
import { getApiPaths, postApiFsOpenDir, postApiFsValidateGhostDir } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import { getAxiosApiErrorBody } from './shared';

import type { Subscription } from 'rxjs';
import type { StateCreator } from 'zustand';

import type { Maybe } from '@planar/shared';

import type { PostApiFsOpenDirErrors, PostApiFsValidateGhostDirErrors } from '@/swagger/client';

import type { LandingState, LandingStateStep4, ZustandSetType } from './types';

const isCanceled = (error: unknown): boolean => isAxiosError(error) && error.code === 'ERR_CANCELED';

const VALIDATION_DEBOUNCE_MS = 300;

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
): Promise<void> => {
  try {
    const paths = await getApiPaths({
      client,
      baseURL: backendUrl(),
      throwOnError: true,
    });
    set({ ghostDir: paths.data.ghost.root });

    await postApiFsOpenDir({
      client,
      baseURL: serverUrl,
      body: { dir: paths.data.ghost.root },
      throwOnError: true,
    });
  }
  catch (e: unknown) {
    console.error(e);
    set({
      step4Comment: translateOpenDirError(getAxiosApiErrorBody(e)),
      step4CommentArgs: {},
      step4ResultType: 'error',
    });
  }
};

const validate = async (
  serverUrl: string,
  set: ZustandSetType<LandingStateStep4>,
  signal: AbortSignal,
): Promise<void> => {
  set({
    step4Loading: true,
    step4Comment: 'landing.step4.comments.loading',
    step4CommentArgs: {},
    step4ResultType: nothing(),
    step4Valid: false,
  });

  try {
    const paths = await getApiPaths({
      client,
      baseURL: backendUrl(),
      throwOnError: true,
    });
    if (signal.aborted) return;
    set({ ghostDir: paths.data.ghost.root });

    await postApiFsValidateGhostDir({
      client,
      baseURL: serverUrl,
      signal,
      throwOnError: true,
    });

    if (signal.aborted) return;
    set({
      step4Loading: false,
      step4Comment: 'landing.step4.comments.success',
      step4CommentArgs: {},
      step4ResultType: 'success',
      step4Valid: true,
    });
  }
  catch (e: unknown) {
    if (signal.aborted || isCanceled(e) || (e instanceof DOMException && e.name === 'AbortError')) return;
    console.error(e);
    set({
      step4Loading: false,
      step4Comment: translateErrorState(getAxiosApiErrorBody(e)),
      step4CommentArgs: {},
      step4ResultType: 'error',
      step4Valid: false,
    });
  }
};

export const useLandingStoreStep4: StateCreator<LandingState, [], [], LandingStateStep4> = (set, get) => {
  let validationAbortController: Maybe<AbortController>;
  let validate$: Maybe<Subject<void>>;
  let subscription: Maybe<Subscription>;

  const cancelValidation = (): void => {
    validationAbortController?.abort();
    validationAbortController = nothing();
  };

  const runValidation = (): Promise<void> => {
    cancelValidation();
    const abortController = new AbortController();
    validationAbortController = abortController;
    const { serverUrl } = get();

    return validate(serverUrl, set, abortController.signal)
      .finally(() => {
        if (validationAbortController === abortController) {
          validationAbortController = nothing();
        }
      });
  };

  const startValidation = (): void => {
    if (subscription && !subscription.closed) return;

    validate$ = new Subject<void>();
    subscription = validate$
      .pipe(debounce(() => interval(VALIDATION_DEBOUNCE_MS)))
      .subscribe(() => {
        runValidation().catch(e => console.error(e));
      });
  };

  const scheduleValidation = (): void => {
    startValidation();
    validate$?.next();
  };

  return {
    ghostDir: '',

    step4Valid: false,
    step4Loading: false,
    step4Comment: '',
    step4CommentArgs: {},
    step4ResultType: nothing(),

    step4Validate: runValidation,
    step4OpenDir: () => {
      const { serverUrl } = get();
      return openDir(serverUrl, set);
    },
    step4Start: scheduleValidation,
    step4Destroy: () => {
      cancelValidation();
      subscription?.unsubscribe();
      validate$?.complete();
      subscription = nothing();
      validate$ = nothing();
    },
  };
};
