import type { Maybe } from '@planar/shared';

export type MosWidgetState = Readonly<{
  loading: boolean;
  moss: string[];
  currentMosId: Maybe<string>;
}>;

export type MosWidgetActions = Readonly<{
  loadMoss: () => Promise<void>;
  loadMos: (mosId: string) => Promise<void>;
}>;
