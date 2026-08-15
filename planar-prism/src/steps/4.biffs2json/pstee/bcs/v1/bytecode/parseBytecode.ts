import { createBcsStream } from '../bcsStream.js';
import { parseSc } from './parseSc.js';

import type { RawBcsScript } from './parseBytecode.types.js';

export const parseBytecode = (code: string): RawBcsScript => {
  const stream = createBcsStream(code);
  return { blocks: parseSc(stream) };
};
