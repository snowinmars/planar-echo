import {
  RE_TOKEN,
  RS_TOKEN,
} from './tokens.js';
import { parseRe } from './parseRe.js';

import type { BcsStream } from '../bcsStream.types.js';
import type { ParsedBcsResponse } from '../bytecode.types.js';

export const parseRs = (stream: BcsStream): ParsedBcsResponse[] => {
  const responses: ParsedBcsResponse[] = [];

  while (!stream.eos() && !stream.skipToken(RS_TOKEN)) {
    if (stream.skipToken(RE_TOKEN)) responses.push(parseRe(stream));
    else stream.skipByte();
  }

  return responses;
};
