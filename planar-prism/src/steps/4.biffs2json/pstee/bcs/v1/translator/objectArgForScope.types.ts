import type { RawBcsArg } from '../../buildBcsContext.types.js';

export type RawBcsTempVariable = Readonly<{
  name: string;
  value: RawBcsArg;
}>;
