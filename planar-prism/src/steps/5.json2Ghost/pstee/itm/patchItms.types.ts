import type { GhostItm } from '@planar/shared';

export type ItmOut = Readonly<{
  resourceName: string;
  skeleton: string;
  itm: GhostItm;
}>;
