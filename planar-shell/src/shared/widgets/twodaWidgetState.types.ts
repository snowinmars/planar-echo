import type { Maybe } from '@planar/shared';

export type TwodaWidgetState = Readonly<{
  loading: boolean;
  twodas: string[];
  currentTwodaId: Maybe<string>;
}>;

export type TwodaWidgetActions = Readonly<{
  loadTwodas: () => Promise<void>;
  loadTwoda: (twodaId: string) => Promise<void>;
}>;
