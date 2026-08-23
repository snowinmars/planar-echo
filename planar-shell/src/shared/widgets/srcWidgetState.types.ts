import type { Maybe } from '@planar/shared';

export type SrcWidgetState = Readonly<{
  loading: boolean;
  srcs: string[];
  currentSrcId: Maybe<string>;
}>;

export type SrcWidgetActions = Readonly<{
  loadSrcs: () => Promise<void>;
  loadSrc: (srcId: string) => Promise<void>;
}>;
