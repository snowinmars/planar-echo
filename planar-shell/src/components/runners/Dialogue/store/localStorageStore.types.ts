import type { GameLanguage } from '@planar/shared';
import type { DisposeFunction } from './helpers';

export type LocalStorageStore = Readonly<{
  serverUrl: string;
  ghostDir: string;
  gameLanguage: GameLanguage;
  dialogueRenderer: string; // TODO [snow]: entype
  dialogueMarks: Readonly<{
    markDisposers: boolean;
    markExterns: boolean;
  }>;

  start: () => DisposeFunction;
}>;
