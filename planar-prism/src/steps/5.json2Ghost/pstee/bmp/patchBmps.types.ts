import type { GhostBmp } from '@planar/shared';

export type GhostBmpOut = Readonly<{
  resourceName: string;
  skeleton: string;
  bmp: GhostBmp;
}>;
