import type { MosV1, MosV2 } from './parseMos.types.js';

export { parseMos } from './parseMos.js';
export { isMosV1Artifacts } from './parseMos.types.js';

export type {
  MosV1,
  MosV2,
};

export type Mos = MosV1 | MosV2;
