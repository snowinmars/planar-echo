import type { GhostIniFile } from './1.toGhost.js';

export type GhostIniOut = Readonly<{
  resourceName: string;
  skeleton: string;
  ini: GhostIniFile;
}>;
