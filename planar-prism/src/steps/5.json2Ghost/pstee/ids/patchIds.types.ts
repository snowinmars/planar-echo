import type { GhostIds } from '@planar/shared';

export type GhostIdsOut = Readonly<{
  resourceName: string;
  skeleton: string;
  ids: GhostIds;
}>;
