import { nothing } from '@planar/shared';
import { findEntry } from './shared.js';

import type { Section } from '../../iniParser/iniParserTypes.js';
import type { SoundsIniSection } from './parseSoundsSectionV1.types.js';
import type { Maybe } from '@planar/shared';

export const parseSoundsSectionV1 = (section: Section): Maybe<SoundsIniSection> => {
  if (section.name !== 'sounds') throw new Error(`Expect section '${section.name}' to be 'sounds' section`);

  /* eslint-disable @stylistic/no-multi-spaces */
  const hitsound = findEntry(section.entries, 'hitsound').stringOrNothing();
  const hitframe = findEntry(section.entries, 'hitframe').decOrNothing();
  const dfbsound = findEntry(section.entries, 'dfbsound').stringOrNothing();
  const dfbframe = findEntry(section.entries, 'dfbframe').decOrNothing();
  const at1Sound = findEntry(section.entries, 'At1Sound').stringOrNothing(); // upper case
  const at1frame = findEntry(section.entries, 'At1frame').decOrNothing();    // upper case
  const at2Sound = findEntry(section.entries, 'At2Sound').stringOrNothing(); // upper case
  const at2frame = findEntry(section.entries, 'At2frame').decOrNothing();    // upper case
  const cf1Sound = findEntry(section.entries, 'Cf1Sound').stringOrNothing(); // upper case
  const cf1frame = findEntry(section.entries, 'Cf1frame').decOrNothing();    // upper case
  /* eslint-enable */

  return {
    hitsound: hitsound?.split(',') ?? nothing(),
    hitframe,
    dfbsound,
    dfbframe,
    at1Sound,
    at1frame,
    at2Sound,
    at2frame,
    cf1Sound,
    cf1frame,
  };
};
