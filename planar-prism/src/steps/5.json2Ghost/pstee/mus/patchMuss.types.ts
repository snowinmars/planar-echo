import type { GhostMus } from '@planar/shared';

export type GhostMusOut = Readonly<{
  resourceName: string;
  skeleton: string;
  mus: GhostMus;
}>;
