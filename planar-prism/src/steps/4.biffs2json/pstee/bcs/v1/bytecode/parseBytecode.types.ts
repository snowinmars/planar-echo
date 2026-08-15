import type { RawBcsCr } from './parseCr.types.js';

export type RawBcsScript = Readonly<{
  blocks: RawBcsCr[];
}>;
