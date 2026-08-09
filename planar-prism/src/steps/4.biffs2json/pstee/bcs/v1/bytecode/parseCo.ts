import {
  CO_TOKEN,
  TR_TOKEN,
} from './tokens.js';
import { parseTr } from './parseTr.js';

import type { BcsStream } from '../bcsStream.types.js';
import type { ParsedBcsTrigger } from '../bytecode.types.js';

export const parseCo = (stream: BcsStream): ParsedBcsTrigger[] => {
  const triggers: ParsedBcsTrigger[] = [];

  while (!stream.eos() && !stream.skipToken(CO_TOKEN)) {
    if (stream.skipToken(TR_TOKEN)) triggers.push(parseTr(stream));
    else stream.skipByte();
  }

  return triggers;
};
