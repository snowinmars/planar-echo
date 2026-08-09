import type { BcsStream } from '../bcsStream.types.js';
import type { ParsedBcsObject } from '../bytecode.types.js';

export type ParsedParameters = Readonly<{
  ints: number[];
  strings: string[];
  objects: ParsedBcsObject[];
}>;
type ParameterLimits = Readonly<{
  ints: number;
  strings: number;
  objects: number;
}>;
export type ParseParameterValuesProps = Readonly<{
  stream: BcsStream;
  closingToken: string;
  limits: ParameterLimits;
}>;
