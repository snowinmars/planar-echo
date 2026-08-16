import type { GhostPvr } from '@planar/shared';

export type GhostPvrOut = Readonly<{
  resourceName: string;
  skeleton: string;
  pvr: GhostPvr;
}>;
