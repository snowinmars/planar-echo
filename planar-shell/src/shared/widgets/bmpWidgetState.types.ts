import type { Maybe } from '@planar/shared';

export type BmpWidgetState = Readonly<{
  loading: boolean;
  bmps: string[];
  currentBmpId: Maybe<string>;
}>;

export type BmpWidgetActions = Readonly<{
  loadBmps: () => Promise<void>;
  loadBmp: (bmpId: string) => Promise<void>;
}>;
