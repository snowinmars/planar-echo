import { extend } from '../../../../pipes/offsetMap.js';
import type { ItemFeatureBlockV10 } from './readFeatureBlockTypesV10.js';

/* createGenerator().register().enum('attackTypeV10',
 *   ['none','melee','ranged','magical','launcher',]
 * ).write();
 */
const attackTypeV10 = {
  0: 'none',
  1: 'melee',
  2: 'ranged',
  3: 'magical',
  4: 'launcher',
} as const;
type AttackTypeV10 = typeof attackTypeV10[keyof typeof attackTypeV10];

/* createGenerator().register().flags('idRequiredV10', {
 *   byte1: ['id required','non-id required']
 * }).write();
 */
const idRequiredV10 = {
  // byte1
  0x1: 'id required',
  0x2: 'non-id required',
  // 0x1: unused
  // 0x2: unused
  // 0x4: unused
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
} as const;
type IdRequiredV10 = typeof idRequiredV10[keyof typeof idRequiredV10];

/* createGenerator().register().enums('locationV10',
 *   ['none','weapon','spell','equipment/item','innate',]
 * ).write();
 */
const locationV10 = {
  0: 'none',
  1: 'weapon',
  2: 'spell',
  3: 'equipment/item',
  4: 'innate',
} as const;
type LocationV10 = typeof locationV10[keyof typeof locationV10];

/* createGenerator().register().enum('targetTypeV10',
 *   ['invalid (cannot be selected)','living actor','inventory','dead actor','any point within range','caster','crash','caster (ee only)',]
 * ).write();
 */
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

/* createGenerator().register().enum('launcherRequiredV10', {
 *   0: ['none','bow','crossbow','sling'],
 *   40: ['spear'],
 *   100: ['throwing axe'],
 * }).write();
 */
const launcherRequiredV10 = {
  0: 'none',
  1: 'bow',
  2: 'crossbow',
  3: 'sling',
  40: 'spear',
  100: 'throwing axe',
} as const;
type LauncherRequiredV10 = typeof launcherRequiredV10[keyof typeof launcherRequiredV10];

/* createGenerator().register().enum('damageTypeV10',
 *   ['none','piercing','crushing','slashing','missile','fist','piercing/crushing (better)','piercing/slashing (better)','crushing/slashing (worse)','blunt missile',]
 * ).write();
 */
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

/* createGenerator().register().enum('chargeDepletionBehaviourV10',
 *   ['item remains','item vanishes','replace with used up','item recharges',]
 * ).write();
 */
const chargeDepletionBehaviourV10 = {
  0: 'item remains',
  1: 'item vanishes',
  2: 'replace with used up',
  3: 'item recharges',
} as const;
type ChargeDepletionBehaviourV10 = typeof chargeDepletionBehaviourV10[keyof typeof chargeDepletionBehaviourV10];

/* createGenerator().register().flags('flagsV10', {
 *   byte1: ['add strength bonus','breakable','damage strength bonus','thac0 strength bonus',],
 *   byte2: [null, 'breaks sanctuary/invisibility','hostile','recharge after resting',],
 *   byte3: null,
 *   byte4: [null,'tobex: toggle backstab','ee/tobex: cannot target invisible',],
 * }).write();
 */
const flagsV10 = {
  // byte1
  0x1: 'add strength bonus',
  0x2: 'breakable',
  0x4: 'damage strength bonus',
  0x8: 'thac0 strength bonus',
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused

  // byte2
  // 0x100: unused
  0x200: 'breaks sanctuary/invisibility',
  0x400: 'hostile',
  0x800: 'recharge after resting',
  // 0x1000: unused
  // 0x2000: unused
  // 0x4000: unused
  // 0x8000: unused

  // byte3
  // unused

  // byte4
  // 0x1000000: unused
  0x2000000: 'tobex: toggle backstab',
  0x4000000: 'ee/tobex: cannot target invisible',
  // 0x8000000: unused
  // 0x10000000: unused
  // 0x20000000: unused
  // 0x40000000: unused
  // 0x80000000: unused
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
