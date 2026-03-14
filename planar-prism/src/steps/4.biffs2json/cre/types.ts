import type { CreatureHeaderV10 } from './v10.types/1.header.js';
import type { KnownSpellV10 } from './v10.types/2.knownSpell.js';
import type { SpellMemorizationInfoPsteeV10, SpellMemorizationInfoV10 } from './v10.types/3.spellMemorizationInfo.js';
import type { MemorizedSpellV10 } from './v10.types/4.memorizedSpell.js';
import type { EffectV10 } from './v10.types/5.effectV10.js';
import type { EffectV20 } from './v10.types/5.effectV20.js';
import type { ItemV10 } from './v10.types/6.item.js';
import type { ItemSlotsBg1Bg2BgeeV10, ItemSlotsPsteeV10 } from './v10.types/7.itemSlot.js';

export type Signature = 'cre';
export type Versions = 'v1.0' | 'v1.1' | 'v1.2' | 'v2.2' | 'v9.0';

export type CreatureV10 = Readonly<{
  resourceName: string;
  header: CreatureHeaderV10;
  knownSpells: KnownSpellV10[];
  spellMemorizationInfos: (SpellMemorizationInfoV10 | SpellMemorizationInfoPsteeV10)[];
  memorizedSpellsTable: MemorizedSpellV10[];
  effects: (EffectV10[] | EffectV20[]);
  itemsTable: ItemV10[];
  itemSlots: (ItemSlotsBg1Bg2BgeeV10 | ItemSlotsPsteeV10);
}>;

export type CreatureV12 = Readonly<{
  resourceName: string;
  header: CreatureHeaderV10; // TODO [snow]: tmp, rewrite
}>;

export type CreatureV22 = Readonly<{
  resourceName: string;
  header: CreatureHeaderV10; // TODO [snow]: tmp, rewrite
}>;

export type CreatureV90 = Readonly<{
  resourceName: string;
  header: CreatureHeaderV10; // TODO [snow]: tmp, rewrite
}>;
