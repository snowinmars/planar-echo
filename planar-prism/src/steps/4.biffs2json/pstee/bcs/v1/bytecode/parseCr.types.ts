import type { RawBcsTrigger } from './parseTr.types.js';
import type { RawBcsResponse } from './parseRe.types.js';

export type RawBcsCr = Readonly<{
  triggers: RawBcsTrigger[];
  responses: RawBcsResponse[];
}>;
