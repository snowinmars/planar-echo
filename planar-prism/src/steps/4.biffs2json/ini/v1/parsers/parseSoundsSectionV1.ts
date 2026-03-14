import { nothing } from '../../../../../shared/maybe.js';
import { parseDecOrNothing, parseDecOrThrow } from '../../../../../shared/customParsers.js';

import type { Section, SectionEntry } from '../../iniParser/iniParserTypes.js';
import type { SoundsIniSection } from '../../types.js';
import type { Maybe } from '../../../../../shared/maybe.js';

const findEntry = (entries: SectionEntry[], key: string): Maybe<string> => entries.find(e => e.key === key)?.value;

const parseSoundsSectionV1 = (section: Section): Maybe<SoundsIniSection> => {
  if (section.name !== 'sounds') throw new Error(`Expect section '${section.name}' to be 'sounds' section`);

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

  return {
    hitsound: hitsound?.split(',') ?? nothing(),
    hitframe: parseDecOrNothing(hitframe),
    dfbsound,
    dfbframe: parseDecOrNothing(dfbframe),
    at1Sound,
    at1frame: parseDecOrNothing(at1frame),
    at2Sound,
    at2frame: parseDecOrNothing(at2frame),
    cf1Sound,
    cf1frame: parseDecOrNothing(cf1frame),
  };
};

export default parseSoundsSectionV1;
