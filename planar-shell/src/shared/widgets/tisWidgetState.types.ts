import type { Maybe } from '@planar/shared';

export type TisWidgetState = Readonly<{
  loading: boolean;
  tiss: string[];
  currentTisId: Maybe<string>;
}>;

export type TisWidgetActions = Readonly<{
  loadTiss: () => Promise<void>;
  loadTis: (tisId: string) => Promise<void>;
}>;
