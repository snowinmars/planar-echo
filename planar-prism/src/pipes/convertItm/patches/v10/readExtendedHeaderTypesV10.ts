import { extend } from '../../../../pipes/offsetMap.js';
import type { ItemFeatureBlockV10 } from './readFeatureBlockTypesV10.js';

const attackTypeV10 = {
  0: 'none',
  1: 'melee',
  2: 'ranged',
  3: 'magical',
  4: 'launcher',
} as const;
type AttackTypeV10 = typeof attackTypeV10[keyof typeof attackTypeV10];

const idRequiredV10 = {
  // byte 1
  0x1: 'id required',
  0x2: 'non-id required',
} as const;
type IdRequiredV10 = typeof idRequiredV10[keyof typeof idRequiredV10];

const locationV10 = {
  0: 'none',
  1: 'weapon',
  2: 'spell',
  3: 'equipment/item',
  4: 'innate',
} as const;
type LocationV10 = typeof locationV10[keyof typeof locationV10];

const targetTypeV10 = {
  0: 'invalid (cannot be selected)',
  1: 'living actor',
  2: 'inventory',
  3: 'dead actor',
  4: 'any point within range',
  5: 'caster',
  6: 'crash',
  7: 'caster (ee only)',
} as const;
type TargetTypeV10 = typeof targetTypeV10[keyof typeof targetTypeV10];

const launcherRequiredV10 = {
  0: 'none',
  1: 'bow',
  2: 'crossbow',
  3: 'sling',
  40: 'spear',
  100: 'throwing axe',
} as const;
type LauncherRequiredV10 = typeof launcherRequiredV10[keyof typeof launcherRequiredV10];

const damageTypeV10 = {
  0: 'none',
  1: 'piercing',
  2: 'crushing',
  3: 'slashing',
  4: 'missile',
  5: 'fist',
  6: 'piercing/crushing (better)',
  7: 'piercing/slashing (better)',
  8: 'crushing/slashing (worse)',
  9: 'blunt missile',
} as const;
type DamageTypeV10 = typeof damageTypeV10[keyof typeof damageTypeV10];

const chargeDepletionBehaviourV10 = {
  0: 'item remains',
  1: 'item vanishes',
  2: 'replace with used up',
  3: 'item recharges',
} as const;
type ChargeDepletionBehaviourV10 = typeof chargeDepletionBehaviourV10[keyof typeof chargeDepletionBehaviourV10];

const flagsV10 = {
  // byte 1
  0x1: 'add strength bonus',
  0x2: 'breakable',
  0x4: 'damage strength bonus',
  0x8: 'thac0 strength bonus',
  // 0x10: unknown,
  // 0x20: unknown,
  // 0x40: unknown,
  // 0x80: unknown,

  // byte 2
  // 0x100: unknown,
  0x200: 'breaks sanctuary/invisibility',
  0x400: 'hostile',
  0x800: 'recharge after resting',
  // 0x1000: unknown,
  // 0x2000: unknown,
  // 0x4000: unknown,
  // 0x8000: unknown,

  // byte 3
  // unknown,

  // byte 4
  // 0x1000000: unknown,
  0x2000000: 'tobex: toggle backstab',
  0x4000000: 'ee/tobex: cannot target invisible',
} as const;
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

export const offsetMap = {
  attackType: extend(attackTypeV10),
  idRequired: extend(idRequiredV10),
  location: extend(locationV10),
  targetType: extend(targetTypeV10),
  launcherRequired: extend(launcherRequiredV10),
  damageType: extend(damageTypeV10),
  chargeDepletionBehaviour: extend(chargeDepletionBehaviourV10),
  flags: extend(flagsV10),
};

export type ItemExtendedHeaderV10 = Readonly<{
  attackType: AttackTypeV10;
  idRequired: IdRequiredV10[];
  location: LocationV10;
  alternativeDiceSides: number;
  useIcon: string;
  targetType: TargetTypeV10;
  targetCount: number;
  range: number;
  launcherRequired: LauncherRequiredV10;
  alternativeDiceThrown: number;
  speedFactor: number;
  alternativeDamageBonus: number;
  thac0bonus: number;
  diceSides: number;
  primaryType: number;
  diceThrown: number;
  secondaryType: number;
  damageBonus: number;
  damageType: DamageTypeV10;
  countOfFeatureBlocks: number;
  indexIntoFeatureBlocks: number;
  maxCharges: number;
  chargeDepletionBehaviour: ChargeDepletionBehaviourV10;
  flags: FlagsV10[];
  projectileAnimation: number;
  meleeAnimation1: number;
  meleeAnimation2: number;
  meleeAnimation3: number;
  bowArrowQualifier: boolean;
  crossbowBoltQualifier: boolean;
  miscProjectileQualifier: boolean;
  featureBlocks: ItemFeatureBlockV10[];
}>;
