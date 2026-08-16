import type { GhostTis } from '@planar/shared';

export type GhostTisOut = Readonly<{
  resourceName: string;
  skeleton: string;
  tis: GhostTis;
}>;
