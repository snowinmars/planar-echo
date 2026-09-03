import { just } from '@planar/shared';

import { parseNumber } from './parseNumber.js';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsRegion } from './parseRegion.types.js';

const START_TOKEN = '[';
const END_TOKEN = ']';
const DELIMITER_TOKEN = '.';
const pointsInRegion = 4; // ...

export const parseRegion = (stream: RawBcsStream): RawBcsRegion => {
  if (stream.getByte() !== START_TOKEN) throw new Error(`Expected '${START_TOKEN}' at position '${stream.positionOf()}'`);

  const values: number[] = [];
  for (let i = 0; i < pointsInRegion; i++) {
    const shouldHaveDelimiter = i > 0;
    // do not extract stream.getByte to variable: it executes only if shouldHaveDelimiter is true
    if (shouldHaveDelimiter && stream.getByte() !== DELIMITER_TOKEN) throw new Error(`Expected '${DELIMITER_TOKEN}' at position '${stream.positionOf()}'`);
    values.push(parseNumber(stream));
  }

  if (stream.getByte() !== END_TOKEN) throw new Error(`Expected '${END_TOKEN}' at position '${stream.positionOf()}'`);

  return {
    x: just(values[0]),
    y: just(values[1]),
    width: just(values[2]),
    height: just(values[3]),
  };
};
