import { parseAc } from './parseAc.js';
import { parseNumber } from './parseNumber.js';
import {
  AC_TOKEN,
  RE_TOKEN,
} from './tokens.js';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsAction } from './parseAc.types.js';
import type { RawBcsResponse } from './parseRe.types.js';

export const parseRe = (stream: RawBcsStream): RawBcsResponse => {
  const weight = parseNumber(stream);
  const actions: RawBcsAction[] = [];

  while (!stream.eos() && !stream.skipToken(RE_TOKEN)) {
    if (stream.skipToken(AC_TOKEN)) actions.push(parseAc(stream));
    else stream.skipByte();
  }

  return { weight, actions };
};
