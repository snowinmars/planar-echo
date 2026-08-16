import type { GhostWed } from '@planar/shared';

export type GhostWedOut = Readonly<{
  resourceName: string;
  skeleton: string;
  wed: GhostWed;
}>;
