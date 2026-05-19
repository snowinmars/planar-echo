import type { Maybe } from '@planar/shared';

export type MonsterPlanescapeIniSection = Readonly<{
  attack1: Maybe<string>;
  attack2: Maybe<string>;
  stance2stand: Maybe<string>;
  stancefidget1: Maybe<string>;
  diebackward: Maybe<string>;
  getup: Maybe<string>;
  gethit: Maybe<string>;
  run: Maybe<string>;
  stand2stance: Maybe<string>;
  standfidget1: Maybe<string>;
  spell1: Maybe<string>;
  spell2: Maybe<string>;
  stance: Maybe<string>;
  stand: Maybe<string>;
  talk1: Maybe<string>;
  walk: Maybe<string>;
  runscale: Maybe<number>;
  bestiary: Maybe<number>;
  armor: Maybe<number>;
}>;
