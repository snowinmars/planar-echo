import { parseDecOrDefault } from './shared.js';

import type { Maybe } from '@planar/shared';
import type { CreatureIniSpec } from './parseSpecV1.types.js';

export const parseSpecV1 = (s: Maybe<string>): string | CreatureIniSpec => {
  if (!s) throw new Error(`Cannot parse Spec variable from nothing`);

  const seemsScriptName = !s.startsWith('[') && !s.endsWith(']');
  if (seemsScriptName) return s;

  // [EA.FACTION.TEAM.GENERAL.RACE.CLASS.SPECIFIC.GENDER.ALIGN]
  const items = s.slice(1, -1).split('.');

  /* eslint-disable @stylistic/no-multi-spaces */
  const ea       = parseDecOrDefault(items[0], 0);
  const faction  = parseDecOrDefault(items[1], 0);
  const team     = parseDecOrDefault(items[2], 0);
  const general  = parseDecOrDefault(items[3], 0);
  const race     = parseDecOrDefault(items[4], 0);
  const clas     = parseDecOrDefault(items[5], 0);
  const specific = parseDecOrDefault(items[6], 0);
  const gender   = parseDecOrDefault(items[7], 0);
  const align    = parseDecOrDefault(items[8], 0);
  /* eslint-enable */

  return {
    ea,
    faction,
    team,
    general,
    race,
    class: clas,
    specific,
    gender,
    align,
  };
};
