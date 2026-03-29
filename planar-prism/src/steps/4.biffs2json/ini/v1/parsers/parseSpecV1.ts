import { parseDecOrDefault } from '@/shared/customParsers.js';
import type { Maybe } from '@planar/shared';
import type { CreatureIniSpec } from '../../types.js';

const parseSpecV1 = (s: Maybe<string>): string | CreatureIniSpec => {
  if (!s) throw new Error(`Cannot parse Spec variable from nothing`);

  const seemsScriptName = !s.startsWith('[') && !s.endsWith(']');
  if (seemsScriptName) return s;

  // [EA.FACTION.TEAM.GENERAL.RACE.CLASS.SPECIFIC.GENDER.ALIGN]
  const items = s.slice(1, -1).split('.');
  return {
    ea: parseDecOrDefault(items[0], 0),
    faction: parseDecOrDefault(items[1], 0),
    team: parseDecOrDefault(items[2], 0),
    general: parseDecOrDefault(items[3], 0),
    race: parseDecOrDefault(items[4], 0),
    class: parseDecOrDefault(items[5], 0),
    specific: parseDecOrDefault(items[6], 0),
    gender: parseDecOrDefault(items[7], 0),
    align: parseDecOrDefault(items[8], 0),
  };
};

export default parseSpecV1;
