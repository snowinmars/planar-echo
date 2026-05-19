import { findEntry } from './shared.js';

import type { Maybe } from '@planar/shared';
import type { Section } from '../../iniParser/iniParserTypes.js';
import type { NumberedSection } from './parseNumberedSectionV1.types.js';

const numberRegex = /^\d+$/;

export const parseNumberedSectionV1 = (section: Section): Maybe<NumberedSection> => {
  const isNumberedSection = numberRegex.test(section.name);
  if (!isNumberedSection) throw new Error(`Expect section '${section.name}' to have number as a section name`);

  /* eslint-disable @stylistic/no-multi-spaces */
  const hitsound      = findEntry(section.entries, 'hitsound').stringOrNothing();
  const hitframe      = findEntry(section.entries, 'hitframe').decOrNothing();
  const dfbsound      = findEntry(section.entries, 'dfbsound').stringOrNothing();
  const dfbframe      = findEntry(section.entries, 'dfbframe').decOrNothing();
  const at1Sound      = findEntry(section.entries, 'At1Sound').stringOrNothing(); // upper case
  const at1frame      = findEntry(section.entries, 'At1frame').decOrNothing();    // upper case
  const at2Sound      = findEntry(section.entries, 'At2Sound').stringOrNothing(); // upper case
  const at2frame      = findEntry(section.entries, 'At2frame').decOrNothing();    // upper case
  const cf1Sound      = findEntry(section.entries, 'Cf1Sound').stringOrNothing(); // upper case
  const cf1frame      = findEntry(section.entries, 'Cf1frame').decOrNothing();    // upper case
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
  const walkscale     = findEntry(section.entries, 'walkscale').decOrNothing();
  const runscale      = findEntry(section.entries, 'runscale').decOrNothing();
  const bestiary      = findEntry(section.entries, 'bestiary').decOrNothing();
  const armor         = findEntry(section.entries, 'armor').decOrNothing();
  /* eslint-enable */

  return {
    hitsound: hitsound?.split(',') ?? [],
    hitframe,
    dfbsound,
    dfbframe,
    at1Sound,
    at1frame,
    at2Sound,
    at2frame,
    cf1Sound,
    cf1frame,
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
    walkscale,
    runscale,
    bestiary,
    armor,
  };
};
