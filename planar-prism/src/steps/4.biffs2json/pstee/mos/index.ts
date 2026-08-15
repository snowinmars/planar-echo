import type { RawMosV1 } from './v1/parseMosV1.types.js';
import type { RawMosV2 } from './v2/parseMosV2.types.js';

export { parseMoss } from './parseMoss.js';
export { isMosV1Artifacts } from './parseMoss.const.js';

export type {
  RawMosV1,
  RawMosV2,
};

export type RawMos = RawMosV1 | RawMosV2;
