import { isNothing } from '@planar/shared';

import type { RawBcsStream } from '../bcsStream.types.js';

export const parseString = (stream: RawBcsStream): string => {
  const value = stream.getMatch('"[^"]*"');
  if (isNothing(value)) throw new Error(`Expected string at position '${stream.positionOf()}'`);

  return value.slice(1, -1);
};
