import type { Maybe } from '@planar/shared';

export type CreWidgetState = Readonly<{
  loading: boolean;
  cres: string[];
  currentCreId: Maybe<string>;
}>;

export type CreWidgetActions = Readonly<{
  loadCres: () => Promise<void>;
  loadCre: (creId: string) => Promise<void>;
}>;
