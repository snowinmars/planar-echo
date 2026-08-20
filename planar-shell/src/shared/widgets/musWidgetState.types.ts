import type { Maybe } from '@planar/shared';

export type MusWidgetState = Readonly<{
  loading: boolean;
  muss: string[];
  currentMusId: Maybe<string>;
}>;

export type MusWidgetActions = Readonly<{
  loadMuss: () => Promise<void>;
  loadMus: (musId: string) => Promise<void>;
}>;
