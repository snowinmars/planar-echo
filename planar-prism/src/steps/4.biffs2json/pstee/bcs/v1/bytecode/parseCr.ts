import {
  CO_TOKEN,
  CR_TOKEN,
  RS_TOKEN,
} from './tokens.js';
import { parseCo } from './parseCo.js';
import { parseRs } from './parseRs.js';

import type { BcsStream } from '../bcsStream.types.js';
import type {
  ParsedBcsCr,
  ParsedBcsResponse,
  ParsedBcsTrigger,
} from '../bytecode.types.js';

export const parseCr = (stream: BcsStream): ParsedBcsCr => {
  const triggers: ParsedBcsTrigger[] = [];
  const responses: ParsedBcsResponse[] = [];

  while (!stream.eos() && !stream.skipToken(CR_TOKEN)) {
    if (stream.skipToken(CO_TOKEN)) triggers.push(...parseCo(stream));
    else if (stream.skipToken(RS_TOKEN)) responses.push(...parseRs(stream));
    else stream.skipByte();
  }

  return { triggers, responses };
};
