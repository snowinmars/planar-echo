import type { Maybe } from '@planar/shared';

import type { RawBcsRegion } from './parseRegion.types.js';

export type RawBcsObject = Readonly<{
  target: number[];
  identifier: number[];
  region: Maybe<RawBcsRegion>;
  name: Maybe<string>;
}>;
