import { just } from '@planar/shared';
import { parseNumber } from './parseNumber.js';

import type { BcsStream } from '../bcsStream.types.js';
import type { BcsRegion } from '../bytecode.types.js';

const START_TOKEN = '[';
const END_TOKEN = ']';
const DELIMITER_TOKEN = '.';
const pointsInRectangle = 4; // ...

export const parseRectangle = (stream: BcsStream): BcsRegion => {
  if (stream.getByte() !== START_TOKEN) throw new Error(`Expected '${START_TOKEN}' at position ${stream.positionOf()}`);

  const values: number[] = [];
  for (let i = 0; i < pointsInRectangle; i++) {
    const shouldHaveDelimiter = i > 0;
    // do not extract stream.getByte to variable: it executes only if shouldHaveDelimiter is true
    if (shouldHaveDelimiter && stream.getByte() !== DELIMITER_TOKEN) throw new Error(`Expected '${DELIMITER_TOKEN}' at position ${stream.positionOf()}`);
    values.push(parseNumber(stream));
  }

  if (stream.getByte() !== END_TOKEN) throw new Error(`Expected '${END_TOKEN}' at position ${stream.positionOf()}`);

  return {
    x: just(values[0]),
    y: just(values[1]),
    width: just(values[2]),
    height: just(values[3]),
  };
};
