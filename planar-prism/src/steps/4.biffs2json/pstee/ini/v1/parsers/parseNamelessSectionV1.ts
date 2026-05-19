import { nothing } from '@planar/shared';
import { parseCoordsV1 } from './parseCoordsV1.js';
import { findEntry } from './shared.js';

import type { Maybe } from '@planar/shared';
import type { NamelessIniSection } from './parseNamelessSectionV1.types.js';
import type { Section } from '../../iniParser/iniParserTypes.js';

export const parseNamelessSectionV1 = (section: Section): Maybe<NamelessIniSection> => {
  if (section.name !== 'nameless') throw new Error(`Expect section '${section.name}' to be 'nameless' section`);

  /* eslint-disable @stylistic/no-multi-spaces */
  const destare          = findEntry(section.entries, 'destare').stringOrThrow(section.name);
  const stringPoint      = findEntry(section.entries, 'point').stringOrThrow(section.name);
  const state            = findEntry(section.entries, 'state').decOrThrow();
  const stringPartyPoint = findEntry(section.entries, 'partyPoint').stringOrNothing();
  const partyArea        = findEntry(section.entries, 'partyArea').stringOrNothing();
  /* eslint-enable */

  const point = parseCoordsV1(stringPoint);
  const partyPoint = stringPartyPoint ? parseCoordsV1(stringPartyPoint) : nothing();

  return {
    destare,
    point,
    state,
    partyPoint,
    partyArea,
  };
};
