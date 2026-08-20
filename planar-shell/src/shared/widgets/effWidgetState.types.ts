import type { Maybe } from '@planar/shared';

export type EffWidgetState = Readonly<{
  loading: boolean;
  effs: string[];
  currentEffId: Maybe<string>;
}>;

export type EffWidgetActions = Readonly<{
  loadEffs: () => Promise<void>;
  loadEff: (effId: string) => Promise<void>;
}>;
