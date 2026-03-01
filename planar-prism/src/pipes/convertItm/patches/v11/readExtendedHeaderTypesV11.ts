import { extend } from '../../../../pipes/offsetMap.js';
import type { ItemFeatureBlockV11 } from './readFeatureBlockTypesV11.js';

const attackTypeV11 = {
  0: 'none',
  1: 'melee',
  2: 'ranged',
  3: 'magic',
  4: 'launcher',
} as const;
type AttackTypeV11 = typeof attackTypeV11[keyof typeof attackTypeV11];

const idRequiredV11 = {
  // byte 1
  0: 'id required',
  1: 'non-id required',
  2: '\'friendly\' ability',
} as const;
type IdRequiredV11 = typeof idRequiredV11[keyof typeof idRequiredV11];

const locationV11 = {
  0: 'none',
  1: 'weapon',
  2: 'spell',
  3: 'equipment',
  4: 'innate',
} as const;
type LocationV11 = typeof locationV11[keyof typeof locationV11];

const targetTypeV11 = {
  0: 'invalid (cannot be selected)',
  1: 'creature',
  2: 'crash',
  3: 'character potrait',
  4: 'area',
  5: 'self',
  6: 'crash',
  7: 'none (self, ignores game pause)',
} as const;
type TargetTypeV11 = typeof targetTypeV11[keyof typeof targetTypeV11];

const projectileTypeV11 = {
  0: 'none',
  1: 'arrow',
  2: 'bolt',
  3: 'bullet',
} as const;
type ProjectileTypeV11 = typeof projectileTypeV11[keyof typeof projectileTypeV11];

const damageTypeV11 = {
  0: 'none',
  1: 'piercing/magic',
  2: 'blunt',
  3: 'slashing',
  4: 'ranged',
  5: 'fists',

  6: 'piercing or crushing', // pstee godaxe.itm
} as const;
type DamageTypeV11 = typeof damageTypeV11[keyof typeof damageTypeV11];

const chargeDepletionBehaviourV11 = {
  0: 'don\'t vanish',
  1: 'expended',
  2: 'expended (w/o sound)',
  3: 'recharge each day',
} as const;
type ChargeDepletionBehaviourV11 = typeof chargeDepletionBehaviourV11[keyof typeof chargeDepletionBehaviourV11];

const flagsV11 = {
  // byte 1
  0x1: 'add strength bonus',
  0x2: 'breakable',
  // 0x4: 'unknown',
  // 0x8: 'unknown',
  // 0x10: 'unknown',
  // 0x20: 'unknown',
  // 0x40: 'unknown',
  // 0x80: 'unknown',

  // byte 2
  // 0x100: 'unknown',
  // 0x200: 'unknown',
  0x400: 'hostile',
  0x800: 'recharges',
  // 0x1000: 'unknown',
  // 0x2000: 'unknown',
  // 0x4000: 'unknown',
  // 0x8000: 'unknown',
} as const;
type FlagsV11 = typeof flagsV11[keyof typeof flagsV11];

export const offsetMap = {
  attackType: extend(attackTypeV11),
  idRequired: extend(idRequiredV11),
  location: extend(locationV11),
  targetType: extend(targetTypeV11),
  projectileType: extend(projectileTypeV11),
  damageType: extend(damageTypeV11),
  chargeDepletionBehaviour: extend(chargeDepletionBehaviourV11),
  flags: extend(flagsV11),
};

export type ItemExtendedHeaderV11 = Readonly<{
  attackType: AttackTypeV11;
  idRequired: IdRequiredV11[];
  location: LocationV11;
  alternativeDiceSides: number;
  useIcon: string;
  targetType: TargetTypeV11;
  targetCount: number;
  range: number;
  projectileType: ProjectileTypeV11;
  alternativeDiceThrown: number;
  speed: number;
  alternativeDamageBonus: number;
  thac0bonus: number;
  diceSides: number;
  primaryType: number;
  diceThrown: number;
  secondaryType: number;
  damageBonus: number;
  damageType: DamageTypeV11;
  countOfFeatureBlocks: number;
  indexIntoFeatureBlocks: number;
  charges: number;
  chargeDepletionBehaviour: ChargeDepletionBehaviourV11;
  flags: FlagsV11[];
  projectileAnimation: number;
  meleeAnimation1: number;
  meleeAnimation2: number;
  meleeAnimation3: number;
  featureBlocks: ItemFeatureBlockV11[];
}>;
