import type { RawBcsResponse } from './parseRe.types.js';
import type { RawBcsTrigger } from './parseTr.types.js';

export type RawBcsCr = Readonly<{
  triggers: RawBcsTrigger[];
  responses: RawBcsResponse[];
}>;
