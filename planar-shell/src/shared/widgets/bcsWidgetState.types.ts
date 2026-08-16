import type { Maybe } from '@planar/shared';

export type BcsWidgetState = Readonly<{
  loading: boolean;
  bcss: string[];
  currentBcsId: Maybe<string>;
}>;

export type BcsWidgetActions = Readonly<{
  loadBcss: () => Promise<void>;
  loadBcs: (bcsId: string) => Promise<void>;
}>;
