import { DEFAULT_ARE } from '@planar/kernel';
import { nothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';

import type { Maybe } from '@planar/shared';

export type PlayBoot = Readonly<{
  are: string;
  entrance: Maybe<string>;
  serverUrl: string;
  ghostDir: string;
}>;
export const playBootFromSearchParams = (params: URLSearchParams): PlayBoot => {
  const are = (params.get('are') ?? DEFAULT_ARE).trim();
  const entrance = params.get('entrance') ?? nothing();

  const serverUrl = planarLocalStorage.get<string>('serverUrl', 'http://localhost:3003');
  const ghostDir = planarLocalStorage.get<string>('ghostDir')!;

  if (!serverUrl) throw new Error('Set server url in localstorage');
  if (!ghostDir) throw new Error('Set ghost url in localstorage');

  return {
    are,
    entrance,
    serverUrl,
    ghostDir,
  };
};
