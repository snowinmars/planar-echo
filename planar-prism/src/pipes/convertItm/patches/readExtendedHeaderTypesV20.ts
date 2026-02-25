import { extend } from '../../../pipes/offsetMap.js';
import type { ItemFeatureBlockV20 } from './readFeatureBlockTypesV20.js';

const attackTypeV20 = {
  0: 'none',
  1: 'melee',
  2: 'ranged',
  3: 'magic',
  4: 'launcher',
} as const;
type AttackTypeV20 = typeof attackTypeV20[keyof typeof attackTypeV20];

const idRequiredV20 = {
  // byte 1
  0: 'id required',
  1: 'non-id required',
} as const;
type IdRequiredV20 = typeof idRequiredV20[keyof typeof idRequiredV20];

const locationV20 = {
  0: 'none',
  1: 'weapon',
  2: 'spell',
  3: 'equipment',
  4: 'innate',
} as const;
type LocationV20 = typeof locationV20[keyof typeof locationV20];

const targetTypeV20 = {
  0: 'invalid (cannot be selected)',
  1: 'creature',
  2: 'crash',
  3: 'character potrait',
  4: 'area',
  5: 'self',
  6: 'crash',
  7: 'none (self, ignores game pause)',
} as const;
type TargetTypeV20 = typeof targetTypeV20[keyof typeof targetTypeV20];

const projectileTypeV20 = {
  0: 'none',
  1: 'arrow',
  2: 'bolt',
  3: 'bullet',
} as const;
type ProjectileTypeV20 = typeof projectileTypeV20[keyof typeof projectileTypeV20];

const damageTypeV20 = {
  0: 'none',
  1: 'piercing/magic',
  2: 'blunt',
  3: 'slashing',
  4: 'ranged',
  5: 'fists',
  6: 'piercing/blunt (more)',
  7: 'piercing/slashing (more)',
  8: 'blunt/slashing (less)',
  9: 'blunt missile',
} as const;
type DamageTypeV20 = typeof damageTypeV20[keyof typeof damageTypeV20];

const chargeDepletionBehaviourV20 = {
  0: 'don\'t vanish',
  1: 'expended',
  2: 'expended (w/o sound)',
  3: 'recharge each day',
} as const;
type ChargeDepletionBehaviourV20 = typeof chargeDepletionBehaviourV20[keyof typeof chargeDepletionBehaviourV20];

const flagsV20 = {
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
type FlagsV20 = typeof flagsV20[keyof typeof flagsV20];

const anotherAttackTypeV20 = {
  0: 'normal',
  1: 'bypass armor',
  2: 'keen',
} as const;
type AnotherAttackTypeV20 = typeof anotherAttackTypeV20[keyof typeof anotherAttackTypeV20];

export const offsetMap = {
  attackType: extend(attackTypeV20),
  idRequired: extend(idRequiredV20),
  location: extend(locationV20),
  targetType: extend(targetTypeV20),
  projectileType: extend(projectileTypeV20),
  damageType: extend(damageTypeV20),
  chargeDepletionBehaviour: extend(chargeDepletionBehaviourV20),
  flags: extend(flagsV20),
  anotherAttackType: extend(anotherAttackTypeV20),
};

export type ItemExtendedHeaderV20 = Readonly<{
  attackType: AttackTypeV20;
  idRequired: IdRequiredV20[];
  location: LocationV20;
  alternativeDiceSides: number;
  useIcon: string;
  targetType: TargetTypeV20;
  targetCount: number;
  range: number;
  projectileType: ProjectileTypeV20;
  alternativeDiceThrown: number;
  speed: number;
  alternativeDamageBonus: number;
  thac0bonus: number;
  diceSides: number;
  primaryType: number;
  diceThrown: number;
  secondaryType: number;
  damageBonus: number;
  damageType: DamageTypeV20;
  countOfFeatureBlocks: number;
  indexIntoFeatureBlocks: number;
  charges: number;
  chargeDepletionBehaviour: ChargeDepletionBehaviourV20;
  flags: FlagsV20[];
  anotherAttackType: AnotherAttackTypeV20;
  projectileAnimation: number;
  meleeAnimation1: number;
  meleeAnimation2: number;
  meleeAnimation3: number;
  bowArrowQualifier: boolean;
  crossbowBoltQualifier: boolean;
  miscProjectileQualifier: boolean;
  featureBlocks: ItemFeatureBlockV20[];
}>;
