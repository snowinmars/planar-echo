import {
  CO_TOKEN,
  TR_TOKEN,
} from './tokens.js';
import { parseTr } from './parseTr.js';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsTrigger } from './parseTr.types.js';

export const parseCo = (stream: RawBcsStream): RawBcsTrigger[] => {
  const triggers: RawBcsTrigger[] = [];

  while (!stream.eos() && !stream.skipToken(CO_TOKEN)) {
    if (stream.skipToken(TR_TOKEN)) triggers.push(parseTr(stream));
    else stream.skipByte();
  }

  return triggers;
};
