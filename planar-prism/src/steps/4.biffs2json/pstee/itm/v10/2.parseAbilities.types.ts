import { extend } from '@/shared/extendedMap.js';

import type { EffectV10 } from './3.parseEffects.types.js';

/* createGenerator().register().enum("attackTypeV10",
 *   ['none','melee','ranged','magic','launcher',]
 * ).write();
 */
const attackTypeV10 = {
  0: 'none',
  1: 'melee',
  2: 'ranged',
  3: 'magic',
  4: 'launcher',
} as const;
type AttackTypeV10 = typeof attackTypeV10[keyof typeof attackTypeV10];

/* createGenerator().register().flags("typeFlagsV10", {
 *   byte1: ['id required','non-id required','friendly ability'],
 * }).write();
 */
const typeFlagsV10 = {
  // byte1
  0x1: 'id required',
  0x2: 'non-id required',
  0x4: 'friendly ability',
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type TypeFlagsV10 = typeof typeFlagsV10[keyof typeof typeFlagsV10];

/* createGenerator().register().enum("abilityLocationV10",
 *   ['none','weapon','spell','equipment','innate',]
 * ).write();
 */
const abilityLocationV10 = {
  0: 'none',
  1: 'weapon',
  2: 'spell',
  3: 'equipment',
  4: 'innate',
} as const;
type AbilityLocationV10 = typeof abilityLocationV10[keyof typeof abilityLocationV10];

/* createGenerator().register().enum("targetTypeV10",
 *   ['invalid (cannot be selected)','creature','crash','character potrait','area','self','crash','none (self, ignores game pause)',]
 * ).write();
 */
const targetTypeV10 = {
  0: 'invalid (cannot be selected)',
  1: 'creature',
  2: 'crash',
  3: 'character potrait',
  4: 'area',
  5: 'self',
  6: 'crash',
  7: 'none (self, ignores game pause)',
} as const;
type TargetTypeV10 = typeof targetTypeV10[keyof typeof targetTypeV10];

/* createGenerator().register().enum("projectileTypeV10",
 *   ['none','arrow','bolt','bullet',]
 * ).write();
 */
const projectileTypeV10 = {
  0: 'none',
  1: 'arrow',
  2: 'bolt',
  3: 'bullet',
} as const;
type ProjectileTypeV10 = typeof projectileTypeV10[keyof typeof projectileTypeV10];

/* createGenerator().register().enum("damageTypeV10",
 *   ['none','piercing/magic','blunt','slashing','ranged','fists','piercing or crushing',]
 * ).write();
 */
const damageTypeV10 = {
  0: 'none',
  1: 'piercing/magic',
  2: 'blunt',
  3: 'slashing',
  4: 'ranged',
  5: 'fists',
  6: 'piercing or crushing',
} as const;
type DamageTypeV10 = typeof damageTypeV10[keyof typeof damageTypeV10];

/* createGenerator().register().enum("chargeDepletionBehaviourV10",
 *   ['do not vanish','expended','expended (w/o sound)','recharge each day',]
 * ).write();
 */
const chargeDepletionBehaviourV10 = {
  0: 'do not vanish',
  1: 'expended',
  2: 'expended (w/o sound)',
  3: 'recharge each day',
} as const;
type ChargeDepletionBehaviourV10 = typeof chargeDepletionBehaviourV10[keyof typeof chargeDepletionBehaviourV10];

/* createGenerator().register().flags("flagsV10", {
 *   byte1: ['add strength bonus', 'breakable'],
 *   byte2: [null, null, 'hostile', 'recharges'],
 * }).write();
 */
const flagsV10 = {
  // byte1
  0x1: 'add strength bonus',
  0x2: 'breakable',
  // 0x4: unused
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused

  // byte2
  // 0x100: unused
  // 0x200: unused
  0x400: 'hostile',
  0x800: 'recharges',
  // 0x1000: unused
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused
} as const;
type FlagsV10 = typeof flagsV10[keyof typeof flagsV10];

export const extendMap = {
  attackType: extend(attackTypeV10),
  typeFlags: extend(typeFlagsV10),
  abilityLocation: extend(abilityLocationV10),
  targetType: extend(targetTypeV10),
  projectileType: extend(projectileTypeV10),
  damageType: extend(damageTypeV10),
  chargeDepletionBehaviour: extend(chargeDepletionBehaviourV10),
  flags: extend(flagsV10),
};

export type AbilityV10 = Readonly<{
  attackType: AttackTypeV10;
  typeFlags: TypeFlagsV10[];
  abilityLocation: AbilityLocationV10;
  alternativeDiceSides: number;
  useIcon: string;
  targetType: TargetTypeV10;
  targetCount: number;
  range: number;
  projectileType: ProjectileTypeV10;
  alternativeDiceThrown: number;
  speed: number;
  alternativeDamageBonus: number;
  thac0bonus: number;
  diceSides: number;
  primaryType: number;
  diceThrown: number;
  secondaryType: number;
  damageBonus: number;
  damageType: DamageTypeV10;
  countOfEffects: number;
  firstEffectIndex: number;
  charges: number;
  chargeDepletionBehaviour: ChargeDepletionBehaviourV10;
  flags: FlagsV10[];
  projectileAnimation: number;
  overhandSwingAnimation: number;
  backhandSwingAnimation: number;
  thrustAnimation: number;
  isArrow: number;
  isBolt: number;
  isBullet: number;
  effects: EffectV10[];
}>;
