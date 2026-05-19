import type { HeaderV10 } from './v10/1.parseHeader.types.js';
import type { AbilityV10 } from './v10/2.parseAbilities.types.js';
import type { EffectV10 } from './v10/3.parseEffects.types.js';

export type Signature = 'itm';
export type Versions = 'v1';

export type ItmV10 = Readonly<{
  resourceName: string;
  header: HeaderV10;
  abilities: AbilityV10[];
  effects: EffectV10[];
}>;
