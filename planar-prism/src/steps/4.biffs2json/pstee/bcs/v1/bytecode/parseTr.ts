import { just, maybe } from '@planar/shared';

import { parseParameterValues } from './parseParameterValues.js';
import { TR_TOKEN } from './tokens.js';

import type { RawBcsStream } from '../bcsStream.types.js';
import type { RawBcsTrigger } from './parseTr.types.js';

export const parseTr = (stream: RawBcsStream): RawBcsTrigger => {
  const { ints, strings, objects } = parseParameterValues({
    stream,
    closingToken: TR_TOKEN,
    limits: { ints: 5, strings: 2, objects: 1 },
  });

  return {
    id: just(ints[0]),
    t1: maybe(ints[1]),
    t2negated: maybe(ints[2]),
    t3: maybe(ints[3]),
    t4: maybe(ints[4]),
    t5: maybe(strings[0]),
    t6: maybe(strings[1]),
    t7: maybe(objects[0]),
  };
};
