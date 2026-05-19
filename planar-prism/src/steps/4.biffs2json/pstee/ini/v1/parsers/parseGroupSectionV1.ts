import { findEntry } from './shared.js';

import type { Maybe } from '@planar/shared';
import type { Section } from '../../iniParser/iniParserTypes.js';
import type { GroupIniSection } from './parseGroupSectionV1.types.js';

export const parseGroupSectionV1 = (section: Section): Maybe<GroupIniSection> => {
  /* eslint-disable @stylistic/no-multi-spaces */
  const critters       = findEntry(section.entries, 'critters').stringOrThrow(section.name);
  const interval       = findEntry(section.entries, 'interval').decOrNothing();
  const detailLevel    = findEntry(section.entries, 'detail_level').stringOrNothing();
  const controlVar     = findEntry(section.entries, 'control_var').stringOrNothing();
  const spawnTimeOfDay = findEntry(section.entries, 'spawn_time_of_day').stringOrNothing();
  /* eslint-enable */

  return {
    name: section.name,
    critters: critters.split(','),
    interval,
    detailLevel,
    controlVar,
    spawnTimeOfDay,
  };
};
