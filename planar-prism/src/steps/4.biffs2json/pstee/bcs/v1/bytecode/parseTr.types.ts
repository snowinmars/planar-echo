import type { Maybe } from '@planar/shared';
import type { RawBcsObject } from './parseOb.types.js';

export type RawBcsTrigger = Readonly<{
  id: number;
  t1: Maybe<number>;
  t2negated: Maybe<number>;
  t3: Maybe<number>;
  t4: Maybe<number>;
  t5: Maybe<string>;
  t6: Maybe<string>;
  t7: Maybe<RawBcsObject>;
}>;
