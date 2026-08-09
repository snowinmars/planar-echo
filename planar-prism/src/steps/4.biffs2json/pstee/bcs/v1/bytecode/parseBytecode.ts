import { createBcsStream } from '../bcsStream.js';
import { parseSc } from './parseSc.js';

import type { ParsedBcsScript } from '../bytecode.types.js';

export const parseBytecode = (code: string): ParsedBcsScript => {
  const stream = createBcsStream(code);
  return { blocks: parseSc(stream) };
};
