import {
  SC_TOKEN,
  CR_TOKEN,
} from './tokens.js';
import { parseCr } from './parseCr.js';

import type { BcsStream } from '../bcsStream.types.js';
import type { ParsedBcsCr } from '../bytecode.types.js';

export const parseSc = (stream: BcsStream): ParsedBcsCr[] => {
  const blocks: ParsedBcsCr[] = [];

  if (!stream.skipToken(SC_TOKEN)) throw new Error(`BCS script must start with '${SC_TOKEN}'`);

  while (!stream.eos() && !stream.skipToken(SC_TOKEN)) {
    if (stream.skipToken(CR_TOKEN)) blocks.push(parseCr(stream));
    else stream.skipByte();
  }

  return blocks;
};
