import {
  SC_TOKEN,
  CR_TOKEN,
} from './tokens.js';
import { parseCr } from './parseCr.js';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsCr } from './parseCr.types.js';

export const parseSc = (stream: RawBcsStream): RawBcsCr[] => {
  const blocks: RawBcsCr[] = [];

  if (!stream.skipToken(SC_TOKEN)) throw new Error(`BCS script must start with '${SC_TOKEN}'`);

  while (!stream.eos() && !stream.skipToken(SC_TOKEN)) {
    if (stream.skipToken(CR_TOKEN)) blocks.push(parseCr(stream));
    else stream.skipByte();
  }

  return blocks;
};
