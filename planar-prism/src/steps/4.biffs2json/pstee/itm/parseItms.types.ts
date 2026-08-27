import type { RawItmHeaderV10 } from './v10/1.parseHeader.types.js';
import type { RawItmAbilityV10 } from './v10/2.parseAbilities.types.js';
import type { RawItmEffectV10 } from './v10/3.parseEffects.types.js';

export type RawItmV10 = Readonly<{
  resourceName: string;
  header: RawItmHeaderV10;
  abilities: RawItmAbilityV10[];
  effects: RawItmEffectV10[];
}>;

export type RawItm = RawItmV10;
