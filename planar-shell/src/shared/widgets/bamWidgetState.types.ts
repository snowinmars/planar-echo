import type { Maybe } from '@planar/shared';

export type BamWidgetState = Readonly<{
  loading: boolean;
  bams: string[];
  currentBamId: Maybe<string>;
}>;

export type BamWidgetActions = Readonly<{
  loadBams: () => Promise<void>;
  loadBam: (bamId: string) => Promise<void>;
}>;
