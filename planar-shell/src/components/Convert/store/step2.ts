import { debounce, interval, Subject } from 'rxjs';

import { nothing } from '@planar/shared';

import { backendUrl } from '@/shared/backendUrl';
import { getApiPaths, postApiFsDownloadWeidu, postApiFsValidateWeiduExeDir } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import { getAxiosApiErrorBody } from './shared';

import type { StateCreator } from 'zustand';

import type { PostApiFsDownloadWeiduErrors, PostApiFsValidateWeiduExeDirErrors } from '@/swagger/client';

import type {
  LandingState,
  LandingStateStep2,
  LandingStateStep3,
  WeiduDownloadPlatform,
  ZustandGetType,
  ZustandSetType,
} from './types';

type FormErrorStateProps = PostApiFsValidateWeiduExeDirErrors[400 | 404];
const translateErrorState = (error: FormErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step2.comments.connection';
  switch (error.error.code) {
    case 'FILE_NOT_FOUND': return 'landing.step2.comments.FILE_NOT_FOUND';
    case 'WEIDU_ERROR': return 'landing.step2.comments.WEIDU_ERROR';
    default: return 'landing.step2.comments.unknown';
  }
};

type DownloadErrorStateProps = PostApiFsDownloadWeiduErrors[404 | 500 | 502];
const translateDownloadError = (error: DownloadErrorStateProps): string => {
  const isConnectionIssue = !error.error;
  if (isConnectionIssue) return 'landing.step2.comments.connection';
  switch (error.error.code) {
    case 'DOWNLOAD_FAILED': return 'landing.step2.comments.DOWNLOAD_FAILED';
    case 'EXTRACT_FAILED': return 'landing.step2.comments.EXTRACT_FAILED';
    case 'BINARY_NOT_FOUND': return 'landing.step2.comments.BINARY_NOT_FOUND';
    default: return 'landing.step2.comments.unknown';
  }
};

const downloadWeidu = async (
  serverUrl: string,
  platform: WeiduDownloadPlatform,
  set: ZustandSetType<LandingStateStep2>,
  get: ZustandGetType<LandingStateStep2>,
): Promise<void> => {
  set({
    step2Loading: true,
    step2Comment: 'landing.step2.comments.downloading',
    step2CommentArgs: {},
    step2ResultType: nothing(),
    step2Valid: false,
  });

  try {
    await postApiFsDownloadWeidu({
      client,
      baseURL: serverUrl,
      body: { platform },
      throwOnError: true,
    });

    const paths = await getApiPaths({
      client,
      baseURL: backendUrl(),
      throwOnError: true,
    });
    set({ weiduExeDir: paths.data.weidu.exe });
    await validate(serverUrl, set, get);
  }
  catch (e: unknown) {
    console.error(e);
    set({
      step2Loading: false,
      step2Comment: translateDownloadError(getAxiosApiErrorBody(e)),
      step2CommentArgs: {},
      step2ResultType: 'error',
      step2Valid: false,
    });
  }
};

const validate = async (serverUrl: string, set: ZustandSetType<LandingStateStep2>, get: ZustandGetType<LandingStateStep2>): Promise<void> => {
  const { weiduExeDir } = get();

  if (!weiduExeDir) {
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
    const { data } = await postApiFsValidateWeiduExeDir({
      client,
      baseURL: serverUrl,
      throwOnError: true,
    });

    set({
      step2Loading: false,
      step2Comment: 'landing.step2.comments.weiduExeVersion',
      step2CommentArgs: { version: data.data.version },
      step2ResultType: 'success',
      step2Valid: true,
    });
  }
  catch (e: unknown) {
    console.error(e);
    set({
      step2Loading: false,
      step2Comment: translateErrorState(getAxiosApiErrorBody(e)),
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
        .catch(e => console.error(e));
    });

  getApiPaths({
    client,
    baseURL: backendUrl(),
    throwOnError: true,
  })
    .then((paths) => {
      set({ weiduExeDir: paths.data.weidu.exe });
      validate$.next();
    })
    .catch((e: unknown) => console.error(e));

  return {
    weiduExeDir: '',

    step2Valid: false,
    step2Loading: false,
    step2Comment: '',
    step2CommentArgs: {},
    step2ResultType: nothing(),

    step2Validate: () => {
      const { serverUrl } = get();
      return validate(serverUrl, set, get);
    },
    step2DownloadWeidu: (platform: WeiduDownloadPlatform) => {
      const { serverUrl } = get();
      return downloadWeidu(serverUrl, platform, set, get);
    },
    step2Destroy: () => {
      subscription.unsubscribe();
      validate$.complete();
    },
  };
};
