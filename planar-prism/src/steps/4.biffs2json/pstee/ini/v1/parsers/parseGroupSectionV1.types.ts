import type { Maybe } from '@planar/shared';

export type GroupIniSection = Readonly<{
  name: string;
  critters: string[];
  interval: Maybe<number>;
  detailLevel: Maybe<string>;
  controlVar: Maybe<string>;
  spawnTimeOfDay: Maybe<string>;
}>;
