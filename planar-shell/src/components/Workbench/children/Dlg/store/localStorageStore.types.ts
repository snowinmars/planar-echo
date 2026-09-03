import type { GameLanguage, Maybe } from '@planar/shared';

import type { DisposeFunction } from './helpers';

export type LocalStorageStore = Readonly<{
  serverUrl: string;
  ghostDir: Maybe<string>;
  gameLanguage: Maybe<GameLanguage>;
  dlgRenderer: string; // TODO [snow]: entype
  dlgMarks: Readonly<{
    markDisposers: boolean;
    markExterns: boolean;
  }>;
  tlkCacheMaxLines: number;

  start: () => DisposeFunction;
}>;
