import type { Maybe } from '@planar/shared';

export type AreWidgetState = Readonly<{
  loading: boolean;
  ares: string[];
  currentAreId: Maybe<string>;
}>;

export type AreWidgetActions = Readonly<{
  loadAres: () => Promise<void>;
  loadAre: (areId: string) => Promise<void>;
}>;
