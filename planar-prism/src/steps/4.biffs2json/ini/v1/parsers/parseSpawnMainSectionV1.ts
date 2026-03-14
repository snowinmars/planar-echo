import { nothing } from '../../../../../shared/maybe.js';

import type { Maybe } from '../../../../../shared/maybe.js';
import type { Section, SectionEntry } from '../../iniParser/iniParserTypes.js';
import type { SpawnMainIniSection } from '../../types.js';

const findEntry = (entries: SectionEntry[], key: string): Maybe<string> => entries.find(e => e.key === key)?.value;

const parseSpawnMainSectionV1 = (section: Section): Maybe<SpawnMainIniSection> => {
  if (section.name !== 'spawn_main') throw new Error(`Expect section '${section.name}' to be 'spawn_main' section`);

  const enter = findEntry(section.entries, 'enter');
  const exit = findEntry(section.entries, 'exit');
  const events = findEntry(section.entries, 'events');

  const foundNothing = !enter && !exit && !events;
  if (foundNothing) return nothing();
  return { enter, exit, events };
};

export default parseSpawnMainSectionV1;
