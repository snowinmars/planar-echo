import type { Maybe } from '@planar/shared';

export type ItmWidgetState = Readonly<{
  loading: boolean;
  itms: string[];
  currentItmId: Maybe<string>;
}>;

export type ItmWidgetActions = Readonly<{
  loadItms: () => Promise<void>;
  loadItm: (itmId: string) => Promise<void>;
}>;
