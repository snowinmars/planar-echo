import type { Maybe } from '@planar/shared';

import type { RawBcsObject } from './parseOb.types.js';

type RawBcsPoint = Readonly<{ x: number; y: number }>;

export type RawBcsAction = Readonly<{
  id: number;
  a1: Maybe<RawBcsObject>;
  a2: Maybe<RawBcsObject>;
  a3: Maybe<RawBcsObject>;
  a4: Maybe<number>;
  a5point: Maybe<RawBcsPoint>;
  a6: Maybe<number>;
  a7: Maybe<number>;
  a8: Maybe<string>;
  a9: Maybe<string>;
}>;
