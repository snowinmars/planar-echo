import type { Ids } from '../../../pipes/convertIds/patches/readIdsBufferTypes.js';
import type { CreatureEffect1V10 } from './v10/readEffects1TypesV10.js';
import type { CreatureEffect2V10 } from './v10/readEffects2TypesV10.js';
import type { CreatureHeaderV10 } from './v10/readHeaderTypesV10.js';
import type { CreatureItemV10 } from './v10/readItemsTableTypesV10.js';
import type { KnownSpellV10 } from './v10/readKnownSpellsTypesV10.js';
import type { MemorizedSpellV10 } from './v10/readMemorizedSpellsTableTypesV10.js';
import type { SpellMemorizationInfoPsteeV10, SpellMemorizationInfoV10 } from './v10/readSpellMemorizationInfoTypesV10.js';
import type { ItemSlotsBg1Bg2BgeeV10, ItemSlotsPsteeV10 } from './v10/readtemSlotsTypesV10.js';

export type CreatureMeta = Readonly<{
  signature: string;
  version: string;
  idsMap: Map<string, Ids>;
  gameName: string;
  resourceName: string;
  isPst: boolean;
  isPstee: boolean;
  isBg: boolean;
  isBgee: boolean;
  isBg2: boolean;
  isBg2ee: boolean;
  isIwd: boolean;
  isIwd2: boolean;
  isTobEx: boolean;
  isv10: boolean;
  isv11: boolean;
  isv12: boolean;
  isv22: boolean;
  isv90: boolean;
  isEe: boolean;
  hasKitIds: boolean;
  hasProftypeIds: boolean;
  emptyInt: number;
}>;

export type CreatureV10 = Readonly<{
  resourceName: string;
  header: CreatureHeaderV10;
  knownSpells: KnownSpellV10[];
  spellMemorizationInfos: (SpellMemorizationInfoV10 | SpellMemorizationInfoPsteeV10)[];
  memorizedSpellsTable: MemorizedSpellV10[];
  effects: (CreatureEffect1V10 | CreatureEffect2V10)[];
  itemsTable: CreatureItemV10[];
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
