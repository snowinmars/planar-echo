import type { Maybe } from '@planar/shared';
import { parseDecOrNothing } from '@/shared/customParsers.js';
import type { Section, SectionEntry } from '../../iniParser/iniParserTypes.js';
import type { MonsterPlanescapeIniSection } from '../../types.js';

const findEntry = (entries: SectionEntry[], key: string): Maybe<string> => entries.find(e => e.key === key)?.value;

const parseMonsterPlanescapeSectionV1 = (section: Section): Maybe<MonsterPlanescapeIniSection> => {
  if (section.name !== 'monster_planescape') throw new Error(`Expect section '${section.name}' to be 'monster_planescape' section`);

  const attack1 = findEntry(section.entries, 'attack1');
  const attack2 = findEntry(section.entries, 'attack2');
  const stance2stand = findEntry(section.entries, 'stance2stand');
  const stancefidget1 = findEntry(section.entries, 'stancefidget1');
  const diebackward = findEntry(section.entries, 'diebackward');
  const getup = findEntry(section.entries, 'getup');
  const gethit = findEntry(section.entries, 'gethit');
  const run = findEntry(section.entries, 'run');
  const stand2stance = findEntry(section.entries, 'stand2stance');
  const standfidget1 = findEntry(section.entries, 'standfidget1');
  const spell1 = findEntry(section.entries, 'spell1');
  const spell2 = findEntry(section.entries, 'spell2');
  const stance = findEntry(section.entries, 'stance');
  const stand = findEntry(section.entries, 'stand');
  const talk1 = findEntry(section.entries, 'talk1');
  const walk = findEntry(section.entries, 'walk');
  const runscale = findEntry(section.entries, 'runscale');
  const bestiary = findEntry(section.entries, 'bestiary');
  const armor = findEntry(section.entries, 'armor');

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
    runscale: parseDecOrNothing(runscale),
    bestiary: parseDecOrNothing(bestiary),
    armor: parseDecOrNothing(armor),
  };
};

export default parseMonsterPlanescapeSectionV1;
