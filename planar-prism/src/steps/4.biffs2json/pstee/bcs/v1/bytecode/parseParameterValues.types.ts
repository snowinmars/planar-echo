import type { RawBcsObject } from './parseOb.types.js';

export type RawBcsParsedParameters = Readonly<{
  ints: number[];
  strings: string[];
  objects: RawBcsObject[];
}>;
