import type { GhostMos, GhostMosV1 } from '@planar/shared';
import type { RawMos } from './parseMoss.types.js';
import type { RawMosV1 } from './v1/parseMosV1.types.js';

export const isRawMosV1 = (mos: RawMos): mos is RawMosV1 => mos.header.version === 'v1';
export const isGhostMosV1 = (mos: GhostMos): mos is GhostMosV1 => mos.header.version === 'v1';
