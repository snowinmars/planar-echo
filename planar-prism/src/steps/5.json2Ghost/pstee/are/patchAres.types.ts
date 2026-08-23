import type { GhostAre } from '@planar/shared';

export type GhostAreOut = Readonly<{
  resourceName: string;
  skeleton: string;
  are: GhostAre;
}>;
