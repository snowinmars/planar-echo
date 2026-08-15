import {
  RE_TOKEN,
  RS_TOKEN,
} from './tokens.js';
import { parseRe } from './parseRe.js';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsResponse } from './parseRe.types.js';

export const parseRs = (stream: RawBcsStream): RawBcsResponse[] => {
  const responses: RawBcsResponse[] = [];

  while (!stream.eos() && !stream.skipToken(RS_TOKEN)) {
    if (stream.skipToken(RE_TOKEN)) responses.push(parseRe(stream));
    else stream.skipByte();
  }

  return responses;
};
