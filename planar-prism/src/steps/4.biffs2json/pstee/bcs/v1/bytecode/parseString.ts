import { isNothing } from '@planar/shared';

import type { BcsStream } from '../bcsStream.types.js';

export const parseString = (stream: BcsStream): string => {
  const value = stream.getMatch('"[^"]*"');
  if (isNothing(value)) throw new Error(`Expected string at position '${stream.positionOf()}'`);

  return value.slice(1, -1);
};
