import type { Maybe } from '@planar/shared';
import type { RawIniCreatureIniSection } from './v1/parsers/parseCreatureSectionV1.types.js';
import type { RawIniNamelessIniSection } from './v1/parsers/parseNamelessSectionV1.types.js';
import type { RawIniSpawnMainIniSection } from './v1/parsers/parseSpawnMainSectionV1.types.js';
import type { RawIniGeneralIniSection } from './v1/parsers/parseGeneralSectionV1.types.js';
import type { RawIniMonsterPlanescapeIniSection } from './v1/parsers/parseMonsterPlanescapeIniSectionV1.types.js';
import type { RawIniSoundsIniSection } from './v1/parsers/parseSoundsSectionV1.types.js';
import type { RawIniNumberedSection } from './v1/parsers/parseNumberedSectionV1.types.js';
import type { RawIniGroupIniSection } from './v1/parsers/parseGroupSectionV1.types.js';

export type RawIni = Readonly<{
  resourceName: string;
  nameless: Maybe<RawIniNamelessIniSection>;
  namelessvar: Maybe<Map<string, number>>;
  locals: Maybe<Map<string, string>>;
  spawnMain: Maybe<RawIniSpawnMainIniSection>;
  general: Maybe<RawIniGeneralIniSection>;
  monsterPlanescape: Maybe<RawIniMonsterPlanescapeIniSection>;
  sounds: Maybe<RawIniSoundsIniSection>;
  numberedSections: RawIniNumberedSection[];
  groupSections: RawIniGroupIniSection[];
  creatureSections: RawIniCreatureIniSection[];
}>;
