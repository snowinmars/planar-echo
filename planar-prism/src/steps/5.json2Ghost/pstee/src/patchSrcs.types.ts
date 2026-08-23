import type { GhostSrc } from '@planar/shared';

export type GhostSrcOut = Readonly<{
  resourceName: string;
  skeleton: string;
  src: GhostSrc;
}>;
