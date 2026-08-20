import type { GhostAcm } from '@planar/shared';

export type GhostAcmOut = Readonly<{
  resourceName: string;
  skeleton: string;
  acm: GhostAcm;
}>;
