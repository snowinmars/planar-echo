import type { Maybe } from '@planar/shared';

export type PvrzWidgetState = Readonly<{
  loading: boolean;
  pvrzs: string[];
  currentPvrzId: Maybe<string>;
}>;

export type PvrzWidgetActions = Readonly<{
  loadPvrzs: () => Promise<void>;
  loadPvrz: (pvrzId: string) => Promise<void>;
}>;
