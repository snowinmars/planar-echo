import { parseDecOrThrow } from '@/shared/customParsers.js';
import { nothing } from '@planar/shared';
import parseCoordsV1 from './parseCoordsV1.js';

import type { Maybe } from '@planar/shared';
import type { NamelessIniSection } from '../../types.js';
import type { Section, SectionEntry } from '../../iniParser/iniParserTypes.js';

const findEntry = (entries: SectionEntry[], key: string): Maybe<string> => entries.find(e => e.key === key)?.value; // TODO [snow]: i do not like this function.

const parseNamelessSectionV1 = (section: Section): Maybe<NamelessIniSection> => {
  if (section.name !== 'nameless') throw new Error(`Expect section '${section.name}' to be 'nameless' section`);

  /* eslint-disable @stylistic/no-multi-spaces */
  const destare    = findEntry(section.entries, 'destare');
  const point      = findEntry(section.entries, 'point');
  const state      = findEntry(section.entries, 'state');
  const partyPoint = findEntry(section.entries, 'partyPoint');
  const partyArea  = findEntry(section.entries, 'partyArea');
  /* eslint-enable */

  if (!destare) throw new Error('Destare is not optional in the \'nameless\' section');
  if (!point) throw new Error('Point is not optional in the \'nameless\' section');
  if (!state) throw new Error('State is not optional in the \'nameless\' section');

  return {
    destare,
    point: parseCoordsV1(point),
    state: parseDecOrThrow(state),
    partyPoint: partyPoint ? parseCoordsV1(partyPoint) : nothing(),
    partyArea,
  };
};

export default parseNamelessSectionV1;
