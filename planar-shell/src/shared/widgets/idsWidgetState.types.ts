import type { Maybe } from '@planar/shared';

export type IdsWidgetState = Readonly<{
  loading: boolean;
  idss: string[];
  currentIdsId: Maybe<string>;
}>;

export type IdsWidgetActions = Readonly<{
  loadIdss: () => Promise<void>;
  loadIds: (idsId: string) => Promise<void>;
}>;
