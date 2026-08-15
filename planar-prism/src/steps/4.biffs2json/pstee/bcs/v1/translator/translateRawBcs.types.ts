import type { RawBcsIfBlock } from './translateRawBcsIfBlock.types.js';

export type RawBcs = Readonly<{
  resourceName: string;
  blocks: RawBcsIfBlock[];
}>;
