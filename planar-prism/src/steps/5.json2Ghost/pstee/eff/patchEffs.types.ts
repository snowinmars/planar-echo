import type { GhostEff } from '@planar/shared';

export type GhostEffOut = Readonly<{
  resourceName: string;
  skeleton: string;
  eff: GhostEff;
}>;
