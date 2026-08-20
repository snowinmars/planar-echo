import type { GhostIni } from '@planar/shared';

export type GhostIniOut = Readonly<{
  resourceName: string;
  skeleton: string;
  ini: GhostIni;
}>;
