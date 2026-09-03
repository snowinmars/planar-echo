import { parseCo } from './parseCo.js';
import { parseRs } from './parseRs.js';
import {
  CO_TOKEN,
  CR_TOKEN,
  RS_TOKEN,
} from './tokens.js';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsCr } from './parseCr.types.js';
import type { RawBcsResponse } from './parseRe.types.js';
import type { RawBcsTrigger } from './parseTr.types.js';

export const parseCr = (stream: RawBcsStream): RawBcsCr => {
  const triggers: RawBcsTrigger[] = [];
  const responses: RawBcsResponse[] = [];

  while (!stream.eos() && !stream.skipToken(CR_TOKEN)) {
    if (stream.skipToken(CO_TOKEN)) triggers.push(...parseCo(stream));
    else if (stream.skipToken(RS_TOKEN)) responses.push(...parseRs(stream));
    else stream.skipByte();
  }

  return { triggers, responses };
};
