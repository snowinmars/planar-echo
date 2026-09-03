import type { RawCreHeaderV10 } from './v10/parsers/1.parseHeaderV10.types.js';
import type { RawCreKnownSpellV10 } from './v10/parsers/2.parseKnownSpellsV10.types.js';
import type { RawCreSpellMemorizationInfoPsteeV10, RawCreSpellMemorizationInfoV10 } from './v10/parsers/3.parseSpellMemorizationInfosV10.types.js';
import type { RawCreMemorizedSpellV10 } from './v10/parsers/4.parseMemorizedSpellsTableV10.types.js';
import type { RawCreEffectV10 } from './v10/parsers/5.parseEffectsV10.types.js';
import type { RawCreEffectV20 } from './v10/parsers/5.parseEffectsV20.types.js';
import type { RawCreItemV10 } from './v10/parsers/6.parseCreItemsV10.types.js';
import type { RawCreItemSlotsV10 } from './v10/parsers/7.parseItemSlotsV10.types.js';
import type { RawCreHeaderV11 } from './v11/parsers/1.parseHeaderV11.types.js';
import type { RawCreKnownSpellV11 } from './v11/parsers/2.parseKnownSpellsV11.types.js';
import type { RawCreSpellMemorizationInfoPsteeV11, RawCreSpellMemorizationInfoV11 } from './v11/parsers/3.parseSpellMemorizationInfosV11.types.js';
import type { RawCreMemorizedSpellV11 } from './v11/parsers/4.parseMemorizedSpellsTableV11.types.js';
import type { RawCreItemV11 } from './v11/parsers/6.parseCreItemsV11.types.js';
import type { RawCreItemSlotsV11 } from './v11/parsers/7.parseItemSlotsV11.types.js';

export type RawCreV10 = Readonly<{
  resourceName: string;
  header: RawCreHeaderV10;
  knownSpells: RawCreKnownSpellV10[];
  spellMemorizationInfos: (RawCreSpellMemorizationInfoV10 | RawCreSpellMemorizationInfoPsteeV10)[];
  memorizedSpellsTable: RawCreMemorizedSpellV10[];
  effects: (RawCreEffectV10[] | RawCreEffectV20[]);
  itemsTable: RawCreItemV10[];
  itemSlots: RawCreItemSlotsV10;
}>;

export type RawCreV11 = Readonly<{
  resourceName: string;
  header: RawCreHeaderV11;
  knownSpells: RawCreKnownSpellV11[];
  spellMemorizationInfos: (RawCreSpellMemorizationInfoV11 | RawCreSpellMemorizationInfoPsteeV11)[];
  memorizedSpellsTable: RawCreMemorizedSpellV11[];
  effects: (RawCreEffectV10[] | RawCreEffectV20[]);
  itemsTable: RawCreItemV11[];
  itemSlots: RawCreItemSlotsV11;
}>;

export type RawCre = RawCreV10 | RawCreV11;
export const isRawCreV10 = (cre: RawCre): cre is RawCreV10 => cre.header.version === 'v1.0';
