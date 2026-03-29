import type { Maybe } from '@planar/shared';
import type { Section, SectionEntry } from '../../iniParser/iniParserTypes.js';
import type { NumberedSection } from '../../types.js';
import { parseDecOrNothing } from '@/shared/customParsers.js';

const numberRegex = /^\d+$/;

const findEntry = (entries: SectionEntry[], key: string): Maybe<string> => entries.find(e => e.key === key)?.value;

const parseNumberedSectionV1 = (section: Section): Maybe<NumberedSection> => {
  const isNumberedSection = numberRegex.test(section.name);
  if (!isNumberedSection) throw new Error(`Expect section '${section.name}' to be has number as a section name`);

  const hitsound = findEntry(section.entries, 'hitsound');
  const hitframe = findEntry(section.entries, 'hitframe');
  const dfbsound = findEntry(section.entries, 'dfbsound');
  const dfbframe = findEntry(section.entries, 'dfbframe');
  const at1Sound = findEntry(section.entries, 'At1Sound'); // upper case
  const at1frame = findEntry(section.entries, 'At1frame'); // upper case
  const at2Sound = findEntry(section.entries, 'At2Sound'); // upper case
  const at2frame = findEntry(section.entries, 'At2frame'); // upper case
  const cf1Sound = findEntry(section.entries, 'Cf1Sound'); // upper case
  const cf1frame = findEntry(section.entries, 'Cf1frame'); // upper case
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
  const walkscale = findEntry(section.entries, 'walkscale');
  const runscale = findEntry(section.entries, 'runscale');
  const bestiary = findEntry(section.entries, 'bestiary');
  const armor = findEntry(section.entries, 'armor');

  return {
    hitsound: hitsound?.split(',') ?? [],
    hitframe: parseDecOrNothing(hitframe),
    dfbsound,
    dfbframe: parseDecOrNothing(dfbframe),
    at1Sound,
    at1frame: parseDecOrNothing(at1frame),
    at2Sound,
    at2frame: parseDecOrNothing(at2frame),
    cf1Sound,
    cf1frame: parseDecOrNothing(cf1frame),
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
    walkscale: parseDecOrNothing(walkscale),
    runscale: parseDecOrNothing(runscale),
    bestiary: parseDecOrNothing(bestiary),
    armor: parseDecOrNothing(armor),
  };
};

export default parseNumberedSectionV1;
