import type { PvrzTis } from '../../parseTis.types.js';

export type ParsePvrzTisResult = Readonly<{
  tis: PvrzTis;
  png: Buffer;
}>;
