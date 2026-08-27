import type { GhostCre } from '@planar/shared';

export type CreOut = Readonly<{
  resourceName: string;
  skeleton: string;
  cre: GhostCre;
}>;
