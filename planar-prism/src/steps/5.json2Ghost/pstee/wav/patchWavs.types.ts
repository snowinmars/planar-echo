import type { GhostWav } from '@planar/shared';

export type GhostWavOut = Readonly<{
  resourceName: string;
  skeleton: string;
  wav: GhostWav;
}>;
