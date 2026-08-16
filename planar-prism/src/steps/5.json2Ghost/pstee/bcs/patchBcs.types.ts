import type { GhostBcs } from '@planar/shared';

export type GhostBcsOut = Readonly<{
  resourceName: string;
  skeleton: string;
  bcs: GhostBcs;
}>;
