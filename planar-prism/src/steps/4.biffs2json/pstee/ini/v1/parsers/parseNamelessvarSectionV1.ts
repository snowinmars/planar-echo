import { parseDecOrThrow } from './shared.js';

import type { Maybe } from '@planar/shared';
import type { Section } from '../../iniParser/iniParserTypes.js';

export const parseNamelessvarSectionV1 = (section: Section): Maybe<Map<string, number>> => {
  if (section.name !== 'namelessvar') throw new Error(`Expect section '${section.name}' to be 'namelessvar' section`);

  return new Map(section.entries.map(({ key, value }) => [key, parseDecOrThrow(value)]));
};
