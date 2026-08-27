import type { GhostItm, GhostItmV10 } from '@planar/shared';
import type { RawItm, RawItmV10 } from './parseItms.types.js';

export const isRawItmV10 = (x: RawItm): x is RawItmV10 => x.header.version === 'v10';
export const isGhostItmV10 = (x: GhostItm): x is GhostItmV10 => x.version === 'v10';
