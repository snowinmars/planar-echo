import { findEntry } from './shared.js';

import type { Maybe } from '@planar/shared';
import type { Section } from '../../iniParser/iniParserTypes.js';
import type { MonsterPlanescapeIniSection } from './parseMonsterPlanescapeIniSectionV1.types.js';

export const parseMonsterPlanescapeIniSectionV1 = (section: Section): Maybe<MonsterPlanescapeIniSection> => {
  if (section.name !== 'monster_planescape') throw new Error(`Expect section '${section.name}' to be 'monster_planescape' section`);

  /* eslint-disable @stylistic/no-multi-spaces */
  const attack1       = findEntry(section.entries, 'attack1').stringOrNothing();
  const attack2       = findEntry(section.entries, 'attack2').stringOrNothing();
  const stance2stand  = findEntry(section.entries, 'stance2stand').stringOrNothing();
  const stancefidget1 = findEntry(section.entries, 'stancefidget1').stringOrNothing();
  const diebackward   = findEntry(section.entries, 'diebackward').stringOrNothing();
  const getup         = findEntry(section.entries, 'getup').stringOrNothing();
  const gethit        = findEntry(section.entries, 'gethit').stringOrNothing();
  const run           = findEntry(section.entries, 'run').stringOrNothing();
  const stand2stance  = findEntry(section.entries, 'stand2stance').stringOrNothing();
  const standfidget1  = findEntry(section.entries, 'standfidget1').stringOrNothing();
  const spell1        = findEntry(section.entries, 'spell1').stringOrNothing();
  const spell2        = findEntry(section.entries, 'spell2').stringOrNothing();
  const stance        = findEntry(section.entries, 'stance').stringOrNothing();
  const stand         = findEntry(section.entries, 'stand').stringOrNothing();
  const talk1         = findEntry(section.entries, 'talk1').stringOrNothing();
  const walk          = findEntry(section.entries, 'walk').stringOrNothing();
  const runscale      = findEntry(section.entries, 'runscale').decOrNothing();
  const bestiary      = findEntry(section.entries, 'bestiary').decOrNothing();
  const armor         = findEntry(section.entries, 'armor').decOrNothing();
  /* eslint-enable */

  return {
    attack1,
    attack2,
    stance2stand,
    stancefidget1,
    diebackward,
    getup,
    gethit,
    run,
    stand2stance,
    standfidget1,
    spell1,
    spell2,
    stance,
    stand,
    talk1,
    walk,
    runscale,
    bestiary,
    armor,
  };
};
