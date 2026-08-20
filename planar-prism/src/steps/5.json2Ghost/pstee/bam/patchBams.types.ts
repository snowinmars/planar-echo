import type { GhostBam } from '@planar/shared';

export type GhostBamOut = Readonly<{
  resourceName: string;
  skeleton: string;
  bam: GhostBam;
}>;
