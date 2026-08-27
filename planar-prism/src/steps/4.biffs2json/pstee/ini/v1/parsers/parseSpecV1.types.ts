import type { Maybe } from '@planar/shared';

export type RawIniCreatureIniSpec = Readonly<{
  ea: Maybe<string>;
  faction: Maybe<string>;
  team: Maybe<string>;
  general: Maybe<string>;
  race: Maybe<string>;
  class: Maybe<string>;
  specifics: Maybe<string>;
  gender: Maybe<string>;
  alignment: Maybe<string>;
}>;
