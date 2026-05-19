import type { EffectV10 } from './v10/parsers/5.parseEffectsV10.types.js';
import type { EffectV20 } from './v10/parsers/5.parseEffectsV20.types.js';

import type { CreatureHeaderV10 } from './v10/parsers/1.parseHeaderV10.types.js';
import type { KnownSpellV10 } from './v10/parsers/2.parseKnownSpellsV10.types.js';
import type { SpellMemorizationInfoPsteeV10, SpellMemorizationInfoV10 } from './v10/parsers/3.parseSpellMemorizationInfosV10.types.js';
import type { MemorizedSpellV10 } from './v10/parsers/4.parseMemorizedSpellsTableV10.types.js';
import type { ItemV10 } from './v10/parsers/6.parseCreatureItemsV10.types.js';
import type { ItemSlotsV10 } from './v10/parsers/7.parseItemSlotsV10.types.js';

import type { CreatureHeaderV11 } from './v11/parsers/1.parseHeaderV11.types.js';
import type { KnownSpellV11 } from './v11/parsers/2.parseKnownSpellsV11.types.js';
import type { SpellMemorizationInfoPsteeV11, SpellMemorizationInfoV11 } from './v11/parsers/3.parseSpellMemorizationInfosV11.types.js';
import type { MemorizedSpellV11 } from './v11/parsers/4.parseMemorizedSpellsTableV11.types.js';
import type { ItemV11 } from './v11/parsers/6.parseCreatureItemsV11.types.js';
import type { ItemSlotsV11 } from './v11/parsers/7.parseItemSlotsV11.types.js';

export type CreatureV10 = Readonly<{
  resourceName: string;
  header: CreatureHeaderV10;
  knownSpells: KnownSpellV10[];
  spellMemorizationInfos: (SpellMemorizationInfoV10 | SpellMemorizationInfoPsteeV10)[];
  memorizedSpellsTable: MemorizedSpellV10[];
  effects: (EffectV10[] | EffectV20[]);
  itemsTable: ItemV10[];
  itemSlots: ItemSlotsV10;
}>;

export type CreatureV11 = Readonly<{
  resourceName: string;
  header: CreatureHeaderV11;
  knownSpells: KnownSpellV11[];
  spellMemorizationInfos: (SpellMemorizationInfoV11 | SpellMemorizationInfoPsteeV11)[];
  memorizedSpellsTable: MemorizedSpellV11[];
  effects: (EffectV10[] | EffectV20[]);
  itemsTable: ItemV11[];
  itemSlots: ItemSlotsV11;
}>;
