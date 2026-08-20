import type { Maybe } from '@planar/shared';

export type AcmWidgetState = Readonly<{
  loading: boolean;
  acms: string[];
  currentAcmId: Maybe<string>;
}>;

export type AcmWidgetActions = Readonly<{
  loadAcms: () => Promise<void>;
  loadAcm: (acmId: string) => Promise<void>;
}>;
