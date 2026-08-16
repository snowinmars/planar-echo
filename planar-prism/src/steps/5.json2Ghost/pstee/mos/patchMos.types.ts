import type { GhostMos } from '@planar/shared';

export type GhostMosOut = Readonly<{
  resourceName: string;
  skeleton: string;
  mos: GhostMos;
}>;
