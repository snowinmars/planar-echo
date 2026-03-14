import { nothing } from '../../../../../shared/maybe.js';

import type { Section } from '../../iniParser/iniParserTypes.js';
import type { Maybe } from '../../../../../shared/maybe.js';

const parseLocalsSectionV1 = (section: Section): Maybe<Map<string, string>> => {
  if (section.name !== 'locals') throw new Error(`Expect section '${section.name}' to be 'locals' section`);

  return new Map(section.entries.map(({ key, value }) => [key, value]));
};

export default parseLocalsSectionV1;
