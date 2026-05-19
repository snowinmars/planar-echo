import type { Maybe } from '@planar/shared';

export type CreatureIniSpecArea = Readonly<{
  centerX: Maybe<number>;
  centerY: Maybe<number>;
  range: Maybe<number>;
  other: Maybe<string>;
}>;
