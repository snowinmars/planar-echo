import {
  isNothing,
  just,
  maybe,
  nothing,
} from '@planar/shared';
import { parseParameterValues } from './parseParameterValues.js';
import { AC_TOKEN } from './tokens.js';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsAction } from './parseAc.types.js';

export const parseAc = (stream: RawBcsStream): RawBcsAction => {
  const { ints, strings, objects } = parseParameterValues({
    stream,
    closingToken: AC_TOKEN,
    limits: { ints: 6, strings: 2, objects: 3 },
  });

  const pointX = maybe(ints[2]);
  const pointY = maybe(ints[3]);
  const hasPoint = !isNothing(pointX) && !isNothing(pointY);

  return {
    id: just(ints[0]),
    a1: maybe(objects[0]),
    a2: maybe(objects[1]),
    a3: maybe(objects[2]),
    a4: maybe(ints[1]),
    a5point: hasPoint ? { x: pointX, y: pointY } : nothing(),
    a6: maybe(ints[4]),
    a7: maybe(ints[5]),
    a8: maybe(strings[0]),
    a9: maybe(strings[1]),
  };
};
