import type { GhostCre, GhostCreV10 } from '@planar/shared';
import type { RawCre, RawCreV10 } from './parseCres.types.js';

export const isRawCreV10 = (x: RawCre): x is RawCreV10 => x.header.version === 'v1.0';
export const isGhostCreV10 = (x: GhostCre): x is GhostCreV10 => x.version === 'v1.0';
