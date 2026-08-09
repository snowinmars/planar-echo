import {
  RE_TOKEN,
  AC_TOKEN,
} from './tokens.js';
import { parseAc } from './parseAc.js';
import { parseNumber } from './parseNumber.js';

import type { BcsStream } from '../bcsStream.types.js';
import type {
  ParsedBcsAction,
  ParsedBcsResponse,
} from '../bytecode.types.js';

export const parseRe = (stream: BcsStream): ParsedBcsResponse => {
  const weight = parseNumber(stream);
  const actions: ParsedBcsAction[] = [];

  while (!stream.eos() && !stream.skipToken(RE_TOKEN)) {
    if (stream.skipToken(AC_TOKEN)) actions.push(parseAc(stream));
    else stream.skipByte();
  }

  return { weight, actions };
};
