import { isNothing } from '@planar/shared';

import type { BcsStream } from '../bcsStream.types.js';

export const parseNumber = (stream: BcsStream): number => {
  const value = stream.getMatch('-?[0-9]+');
  if (isNothing(value)) throw new Error(`Expected number at position '${stream.positionOf()}'`);

  const number = Number.parseInt(value, 10);
  if (isNaN(number)) throw new Error(`Expected valid number at position '${stream.positionOf()}'`);

  return number;
};
