import type { Maybe } from '@planar/shared';

export type WedWidgetState = Readonly<{
  loading: boolean;
  weds: string[];
  currentWedId: Maybe<string>;
}>;

export type WedWidgetActions = Readonly<{
  loadWeds: () => Promise<void>;
  loadWed: (wedId: string) => Promise<void>;
}>;
