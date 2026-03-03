import { extend } from '../../../../pipes/offsetMap.js';
import type { ItemFeatureBlockV11 } from './readFeatureBlockTypesV11.js';

/* createGenerator().register().enum("attackTypeV11",
 *   ['none','melee','ranged','magic','launcher',]
 * ).write();
 */
const attackTypeV11 = {
  0: 'none',
  1: 'melee',
  2: 'ranged',
  3: 'magic',
  4: 'launcher',
} as const;
type AttackTypeV11 = typeof attackTypeV11[keyof typeof attackTypeV11];

/* createGenerator().register().flags("idRequiredV11", {
 *   byte1: ['id required','non-id required','friendly ability'],
 * }).write();
 */
const idRequiredV11 = {
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
type IdRequiredV11 = typeof idRequiredV11[keyof typeof idRequiredV11];

/* createGenerator().register().enum("locationV11",
 *   ['none','weapon','spell','equipment','innate',]
 * ).write();
 */
const locationV11 = {
  0: 'none',
  1: 'weapon',
  2: 'spell',
  3: 'equipment',
  4: 'innate',
} as const;
type LocationV11 = typeof locationV11[keyof typeof locationV11];

/* createGenerator().register().enum("targetTypeV11",
 *   ['invalid (cannot be selected)','creature','crash','character potrait','area','self','crash','none (self, ignores game pause)',]
 * ).write();
 */
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

/* createGenerator().register().enum("projectileTypeV11",
 *   ['none','arrow','bolt','bullet',]
 * ).write();
 */
const projectileTypeV11 = {
  0: 'none',
  1: 'arrow',
  2: 'bolt',
  3: 'bullet',
} as const;
type ProjectileTypeV11 = typeof projectileTypeV11[keyof typeof projectileTypeV11];

/* createGenerator().register().enum("damageTypeV11",
 *   ['none','piercing/magic','blunt','slashing','ranged','fists','piercing or crushing',]
 * ).write();
 */
const damageTypeV11 = {
  0: 'none',
  1: 'piercing/magic',
  2: 'blunt',
  3: 'slashing',
  4: 'ranged',
  5: 'fists',
  6: 'piercing or crushing',
} as const;
type DamageTypeV11 = typeof damageTypeV11[keyof typeof damageTypeV11];

/* createGenerator().register().enum("chargeDepletionBehaviourV11",
 *   ['do not vanish','expended','expended (w/o sound)','recharge each day',]
 * ).write();
 */
const chargeDepletionBehaviourV11 = {
  0: 'do not vanish',
  1: 'expended',
  2: 'expended (w/o sound)',
  3: 'recharge each day',
} as const;
type ChargeDepletionBehaviourV11 = typeof chargeDepletionBehaviourV11[keyof typeof chargeDepletionBehaviourV11];

/* createGenerator().register().flags("flagsV11", {
 *   byte1: ['add strength bonus', 'breakable'],
 *   byte2: [null, null, 'hostile', 'recharges'],
 * }).write();
 */
const flagsV11 = {
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
