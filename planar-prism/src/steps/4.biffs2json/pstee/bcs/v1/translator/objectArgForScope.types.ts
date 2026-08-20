import type { RawBcsArg } from '../../context/buildBcsContext.types.js';

export type RawBcsTempVariable = Readonly<{
  name: string;
  value: RawBcsArg;
}>;
