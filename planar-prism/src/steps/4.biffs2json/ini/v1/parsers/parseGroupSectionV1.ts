import { parseDecOrNothing } from '../../../../../shared/customParsers.js';

import type { Maybe } from '../../../../../shared/maybe.js';
import type { Section, SectionEntry } from '../../iniParser/iniParserTypes.js';
import type { GroupIniSection } from '../../types.js';

const findEntry = (entries: SectionEntry[], key: string): Maybe<string> => entries.find(e => e.key === key)?.value;

const parseGroupSectionV1 = (section: Section): Maybe<GroupIniSection> => {
  const critters = findEntry(section.entries, 'critters');
  const interval = findEntry(section.entries, 'interval');
  const detailLevel = findEntry(section.entries, 'detail_level');
  const controlVar = findEntry(section.entries, 'control_var');
  const spawnTimeOfDay = findEntry(section.entries, 'spawn_time_of_day');

  if (!critters) throw new Error(`Critters should not be optional for group ini section ${section.name}`);

  return {
    name: section.name,
    critters: critters.split(','),
    interval: parseDecOrNothing(interval),
    detailLevel,
    controlVar,
    spawnTimeOfDay,
  };
};

export default parseGroupSectionV1;
