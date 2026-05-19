import type { Maybe } from '@planar/shared';
import type { CreatureIniSection } from './v1/parsers/parseCreatureSectionV1.types.js';
import type { NamelessIniSection } from './v1/parsers/parseNamelessSectionV1.types.js';
import type { SpawnMainIniSection } from './v1/parsers/parseSpawnMainSectionV1.types.js';
import type { GeneralIniSection } from './v1/parsers/parseGeneralSectionV1.types.js';
import type { MonsterPlanescapeIniSection } from './v1/parsers/parseMonsterPlanescapeIniSectionV1.types.js';
import type { SoundsIniSection } from './v1/parsers/parseSoundsSectionV1.types.js';
import type { NumberedSection } from './v1/parsers/parseNumberedSectionV1.types.js';
import type { GroupIniSection } from './v1/parsers/parseGroupSectionV1.types.js';

export type Signature = 'ini';
export type Versions = 'v1.0';

export type Ini = Readonly<{
  resourceName: string;
  nameless: Maybe<NamelessIniSection>;
  namelessvar: Maybe<Map<string, number>>;
  locals: Maybe<Map<string, string>>;
  spawnMain: Maybe<SpawnMainIniSection>;
  general: Maybe<GeneralIniSection>;
  monsterPlanescape: Maybe<MonsterPlanescapeIniSection>;
  sounds: Maybe<SoundsIniSection>;
  numberedSections: NumberedSection[];
  groupSections: GroupIniSection[];
  creatureSections: CreatureIniSection[];
}>;
