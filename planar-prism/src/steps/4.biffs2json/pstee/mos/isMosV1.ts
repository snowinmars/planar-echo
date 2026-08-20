import type { RawMos } from './parseMoss.types.js';
import type { RawMosV1 } from './v1/parseMosV1.types.js';

export const isMosV1 = (mos: RawMos): mos is RawMosV1 => mos.variant === 'v1';
