import { nothing } from '@planar/shared';
import { findEntry } from './shared.js';

import type { Maybe } from '@planar/shared';
import type { Section } from '../../iniParser/iniParserTypes.js';
import type { SpawnMainIniSection } from './parseSpawnMainSectionV1.types.js';

export const parseSpawnMainSectionV1 = (section: Section): Maybe<SpawnMainIniSection> => {
  if (section.name !== 'spawn_main') throw new Error(`Expect section '${section.name}' to be 'spawn_main' section`);

  /* eslint-disable @stylistic/no-multi-spaces */
  const enter  = findEntry(section.entries, 'enter').stringOrNothing();
  const exit   = findEntry(section.entries, 'exit').stringOrNothing();
  const events = findEntry(section.entries, 'events').stringOrNothing();
  /* eslint-enable */

  const foundNothing = !enter && !exit && !events;
  if (foundNothing) return nothing();

  return {
    enter,
    exit,
    events,
  };
};
